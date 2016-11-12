//------------------------------//
//  NPCMovement.js              //
//  Written by Alucard Jay      //
//  5/10/2013                   //
//------------------------------//

#pragma strict
@script RequireComponent( Rigidbody )

private var myTransform : Transform; // us as the NPC
private var myRigidbody : Rigidbody;

var target : Transform; // the Player

var playerHealthScript : PlayerHealth;

var moveSpeed : float = 6.0;
var turnSpeed : float = 2.0;

private var desiredVelocity : Vector3;

var isGrounded : boolean = false;

var rayDistance : float = 5.0;


enum NPC
{
	Idle,
	FreeRoam,
	Chasing,
	RunningAway
}

var myState : NPC;

var minimumRange : float = 35.0;
var maximumRange : float = 35.0;

private var minimumRangeSqr : float;
private var maximumRangeSqr : float;

var isNpcChasing : boolean = true;

var freeRoamTimer : float = 0.0;
var freeRoamTimerMax : float = 5.0;
var freeRoamTimerMaxRange : float = 1.5;
var freeRoamTimerMaxAdjusted : float = 5.0;

private var calcDir : Vector3 = Vector3.forward;

var isSlender : boolean = true;

var isVisible : boolean = false;

var offScreenDot : float = 0.8;

public var enemySightedSound : AudioClip;

private var hasPlayedSeenSound : boolean = false;

private var reduceDistanceAmount : float;

var increaseSpeedAmount : float = 0.2;


// -- Persistant Functions --


function Start() 
{
	reduceDistanceAmount = ( maximumRange - 4.0 ) / 7.0;
	
	myTransform = transform;
	myRigidbody = rigidbody;
	
	myRigidbody.freezeRotation = true;
	
	freeRoamTimer = 1000.0;
	
	if ( isSlender )
	{
		//InvokeRepeating( "TeleportEnemy", 60.0, 20.0 ); // the actual game values
		InvokeRepeating( "TeleportEnemy", 5.0, 10.0 ); // TESTING values
		
		minimumRange = maximumRange;
		
		var targetObject : GameObject = GameObject.Find( "Player" );
		
		if ( targetObject )
		{
			target = targetObject.transform;
			
			playerHealthScript = target.GetComponent( PlayerHealth );
		}
		else
		{
			Debug.Log( "no object named player was found" );
		}
		
		// check if player has been dropped in to the inspector
		if ( !target )
		{
			Debug.LogWarning( "No Target Object in the Inspector" );
			target = GameObject.Find( "Player" ).transform;
		}
		
		if ( !playerHealthScript )
		{
			Debug.LogWarning( "No playerHealthScript Object in the Inspector" );
			target.GetComponent( PlayerHealth );
		}
	}
	
	minimumRangeSqr = minimumRange * minimumRange;
	maximumRangeSqr = maximumRange * maximumRange;
}


function Update() 
{
	if ( isSlender )
	{
		SlenderDecisions();
	}
	else
	{
		MakeSomeDecisions();
	}	
	
	
	
	switch( myState )
	{
		case NPC.Idle :
			// looking directly at player
			//myTransform.LookAt( target ); 
			
			// looking towards player but upright
			var targetLookRot : Vector3 = Vector3( target.position.x, myTransform.position.y, target.position.z ); 
			myTransform.LookAt( targetLookRot );
			
			 // only use the gravity Y velocity
			desiredVelocity = new Vector3( 0, myRigidbody.velocity.y, 0 );
		break;
		
		case NPC.FreeRoam :
			freeRoamTimer += Time.deltaTime;
			
			if ( freeRoamTimer > freeRoamTimerMaxAdjusted )
			{
				freeRoamTimer = 0.0;
				freeRoamTimerMaxAdjusted = freeRoamTimerMax + Random.Range( -freeRoamTimerMaxRange, freeRoamTimerMaxRange );
				
				calcDir = Random.onUnitSphere;
				calcDir.y = 0.0;
			}
			
			Moving( calcDir );
		break;
		
		case NPC.Chasing :
			Moving( (target.position - myTransform.position).normalized );
		break;
		
		case NPC.RunningAway :
			Moving( (myTransform.position - target.position).normalized );
		break;
	}
}


function FixedUpdate()
{
	if ( isGrounded )
	{
		myRigidbody.velocity = desiredVelocity;
	}
}


// -- Logic Functions --


function MakeSomeDecisions() 
{
	var sqrDist : float = ( target.position - myTransform.position ).sqrMagnitude;
	
	if ( sqrDist > maximumRangeSqr )
	{
		if ( isNpcChasing )
		{
			myState = NPC.Chasing;
		}
		else
		{
			myState = NPC.FreeRoam;
		}
	}
	else if ( sqrDist < minimumRangeSqr )
	{
		if ( isNpcChasing )
		{
			myState = NPC.Idle;
		}
		else
		{
			myState = NPC.RunningAway;
		}
	}
	else
	{
		if ( isNpcChasing )
		{
			myState = NPC.Chasing;
		}
		else
		{
			myState = NPC.RunningAway;
		}
	}
}


function TeleportEnemy() // 360' teleporting
{
	CheckIfVisible();
	
	if ( !isVisible )
	{
		// choose a random angle
		var angle : Quaternion = Quaternion.Euler( 0.0, Random.Range( 0.0, 359.9 ), 0.0 );
		
		var terrainPosCheck : Vector3 = angle * target.forward;
		
		terrainPosCheck *= minimumRange;
		terrainPosCheck += target.position;
		terrainPosCheck.y = 5000.0;
		
		// raycast to check if position on the terrain is free
		var hit : RaycastHit;
		
		if ( Physics.Raycast( terrainPosCheck, -Vector3.up, hit, Mathf.Infinity ) )
		{
			if ( hit.collider.gameObject.name == "Terrain" )
			{
				myTransform.position = hit.point + new Vector3( 0, 0.25, 0 );
			}
		}
	}
}


function TeleportEnemyLeftOrRight() 
{
	CheckIfVisible();
	
	if ( !isVisible )
	{
		// find position left or right of the player target
		var rndDir : int = Random.Range( 0, 2 );
		
		if ( rndDir == 0 )
		{
			rndDir = -1;
		}
		
		var terrainPosCheck : Vector3 = target.position + ( rndDir * target.right * minimumRange );
		
		terrainPosCheck.y = 5000.0;
		
		// raycast to check if position on the terrain is free
		var hit : RaycastHit;
		
		if ( Physics.Raycast( terrainPosCheck, -Vector3.up, hit, Mathf.Infinity ) )
		{
			if ( hit.collider.gameObject.name == "Terrain" )
			{
				myTransform.position = hit.point + new Vector3( 0, 0.25, 0 );
			}
		}
	}
}


function SlenderDecisions() 
{
	CheckIfVisible();
	
	var sqrDist : float = ( target.position - myTransform.position ).sqrMagnitude;
	
	if ( isVisible )
	{
		// check the range
		if ( sqrDist > maximumRangeSqr )
		{
			myState = NPC.Chasing;
			playerHealthScript.IncreaseHealth();
		}
		else
		{
			var hit : RaycastHit;
			
			if ( Physics.Linecast( myTransform.position, target.position, hit ) )
			{
				//Debug.Log( hit.collider.gameObject.name );
				
				Debug.DrawLine( myTransform.position, target.position, Color.green );
				
				if ( hit.collider.gameObject.name == target.name )
				{
					myState = NPC.Idle;
					
					// decrease the health of the player
					playerHealthScript.DecreaseHealth();
					
					if ( !hasPlayedSeenSound )
					{
						audio.PlayClipAtPoint( enemySightedSound, target.position );
						hasPlayedSeenSound = true;
					}
					
				}
				else
				{
					myState = NPC.Chasing;
					playerHealthScript.IncreaseHealth();
				}
			}
		}
	}
	else // is NOT visible
	{
		if ( sqrDist > minimumRangeSqr )
		{
			myState = NPC.Chasing;
		}
		else
		{
			myState = NPC.Idle;
		}
		
		playerHealthScript.IncreaseHealth();
		
		hasPlayedSeenSound = false;
	}
}


function CheckIfVisible() 
{
	var fwd : Vector3 = target.forward;
	var other : Vector3 = ( myTransform.position - target.position ).normalized;
	
	var dotProduct : float = Vector3.Dot( fwd, other );
	
	isVisible = false;
	
	if ( dotProduct > offScreenDot )
	{
		isVisible = true;
	}
}


function ReduceDistance()
{
	minimumRange -= reduceDistanceAmount;
	minimumRangeSqr = minimumRange * minimumRange;
	
	moveSpeed += increaseSpeedAmount;
}


function Moving( lookDirection : Vector3 ) 
{
	// rotation
	//var lookDirection : Vector3 = (target.position - myTransform.position).normalized;
	
	var hit : RaycastHit;
	
	var shoulderMultiplier : float = 0.75;
	
	var leftRayPos : Vector3 = myTransform.position - ( myTransform.right * shoulderMultiplier );
	var rightRayPos : Vector3 = myTransform.position + ( myTransform.right * shoulderMultiplier );
	
	if ( Physics.Raycast( leftRayPos, myTransform.forward, hit, rayDistance ) )
	{
		if ( hit.collider.gameObject.name != "Terrain" )
		{
			Debug.DrawLine( leftRayPos, hit.point, Color.red );
			
			lookDirection += hit.normal * 20.0;
		}
	}
	else if ( Physics.Raycast( rightRayPos, myTransform.forward, hit, rayDistance ) )
	{
		if ( hit.collider.gameObject.name != "Terrain" )
		{
			Debug.DrawLine( rightRayPos, hit.point, Color.red );
			
			lookDirection += hit.normal * 20.0;
		}
	}
	else
	{
		Debug.DrawRay( leftRayPos, myTransform.forward * rayDistance, Color.yellow );
		Debug.DrawRay( rightRayPos, myTransform.forward * rayDistance, Color.yellow );
	}
	
	
	//Debug.Log( "velocity = " + myRigidbody.velocity + " : vel mag = " + myRigidbody.velocity.magnitude + " : vel mag sqr = " + myRigidbody.velocity.sqrMagnitude );
	
	// if myRigidbody.velocity.sqrMagnitude < 1.75 then the NPC is stuck
	if ( myRigidbody.velocity.sqrMagnitude < 1.75 )
	{
		lookDirection += myTransform.right * 20.0;
	}
	
	
	var lookRot : Quaternion = Quaternion.LookRotation( lookDirection );
	
	myTransform.rotation = Quaternion.Slerp( myTransform.rotation, lookRot, turnSpeed * Time.deltaTime );
	
	// movement	
	desiredVelocity = myTransform.forward * moveSpeed;
	desiredVelocity.y = myRigidbody.velocity.y;
}


// -- Collision Events --


function OnCollisionEnter( collision : Collision )
{
	if ( collision.collider.gameObject.name == "Floor" || collision.collider.gameObject.name == "Terrain" )
	{
		isGrounded = true;
	}
}


function OnCollisionStay( collision : Collision )
{
	if ( collision.collider.gameObject.name == "Floor" || collision.collider.gameObject.name == "Terrain" )
	{
		isGrounded = true;
	}
}


function OnCollisionExit( collision : Collision )
{
	if ( collision.collider.gameObject.name == "Floor" || collision.collider.gameObject.name == "Terrain" )
	{
		isGrounded = false;
	}
}
