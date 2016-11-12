//------------------------------//
//  CollectPapers.js            //
//  Written by Alucard Jay      //
//  5/10/2013                   //
//------------------------------//

#pragma strict
@script RequireComponent( AudioSource )

var papers : int = 0; // counter of how many papers collected
var papersToWin : int = 8; // total number of papers in the scene

var distanceToPaper : float = 5.5; // maximum distance that the raycast will detect
var sphereRadius : float = 1.0; // the width of the sphere that is being SphereCast

public var scaleTimerMax : float = 1.5; // how fast the paper disappears

var paperSound : AudioClip;

var enemyScript : NPCMovement;

var musicManagerScript : MusicManager;


private var currentPaperMaterial : Material;

public var paperDisplayObject : Transform;
public var paperDisplayLight : Light;
public var paperDisplayParticles : ParticleEmitter;

private var startPos : Vector3;
private var startScale : Vector3;

private var particleStartPos : Vector3;


function Start() 
{
	if ( !enemyScript )
	{
		Debug.LogWarning( "No Enemy Script in the Inspector" );
		var nme : GameObject = GameObject.Find( "Enemy" );
		enemyScript = nme.GetComponent( NPCMovement );
	}
	
	if ( !musicManagerScript )
	{
		Debug.LogWarning( "No Music Manager Script in the Inspector" );
		var mmngr : GameObject = GameObject.Find( "MusicManager" );
		musicManagerScript = mmngr.GetComponent( MusicManager );
	}
	
	if ( !paperDisplayObject )
	{
		Debug.LogWarning( "No paper Display Object in the Inspector" );
		paperDisplayObject = GameObject.Find( "PaperDisplayObject" ).transform;
	}
	
	if ( !paperDisplayLight )
	{
		Debug.LogWarning( "No paper Display Light in the Inspector" );
		paperDisplayLight = GameObject.Find( "PaperViewSpotlight" ).light;
	}
	
	if ( !paperDisplayParticles )
	{
		Debug.LogWarning( "No paper Display Particles in the Inspector" );
		paperDisplayParticles = GameObject.Find( "DustParticleEffect" ).particleEmitter;
	}
	
	paperDisplayObject.renderer.enabled = false;
	paperDisplayLight.enabled = false;
	paperDisplayParticles.emit = false;
	
	particleStartPos = paperDisplayParticles.transform.localPosition;
	
	startPos = paperDisplayObject.localPosition;
	startScale = paperDisplayObject.localScale;
}


function Update() 
{
	if ( Input.GetMouseButtonDown(0) || Input.GetKeyDown( KeyCode.E ) )
	{
		var hit : RaycastHit;
		
		var rayOrigin : Ray = Camera.main.ScreenPointToRay( Vector3( Screen.width * 0.5, Screen.height * 0.5, 0 ) );
		
		if ( Physics.SphereCast( rayOrigin, sphereRadius, hit, distanceToPaper ) )
		{
			//Debug.Log( "SphereCast Hit : " + hit.collider.gameObject.name );
			//Debug.DrawLine( Camera.main.transform.position, hit.point, Color.red, 1.5 );
			
			if ( hit.collider.gameObject.name == "Paper" )
			{
				//Debug.Log( "SPHERE hit Paper for sure" );
				
				papers += 1;
				
				// play paper has been picked up sound
				audio.PlayClipAtPoint( paperSound, hit.point );
				
				// destroy the paper
				Destroy( hit.collider.gameObject );
				
				// tell enemy to follow closer
				enemyScript.ReduceDistance();
				
				// tell enemy to teleport now (if you want)
				enemyScript.TeleportEnemy();
				
				// tell the player they go mad quicker
				gameObject.SendMessage( "DecreaseHealthDecayRate", SendMessageOptions.RequireReceiver );
				
				// change the music based on the number of papers collected
				if ( papers == 2 )
				{
					musicManagerScript.PlayMusicTrack( 1 );
				}
				else if ( papers == 4 )
				{
					musicManagerScript.PlayMusicTrack( 2 );
				}
				else if ( papers == 6 )
				{
					musicManagerScript.PlayMusicTrack( 3 );
				}
				else if ( papers == papersToWin )
				{
					Debug.Log( "You have collected All Papers !" );
					
					// load Win Scene here !!!!
					Application.LoadLevel( "SceneWin" );
				}
				
				// set current paper material
				currentPaperMaterial = hit.collider.gameObject.renderer.material;
				
				DisplayPaper();
			}
			
		}
	}
}


function DisplayPaper() 
{
	// reset the size
	paperDisplayObject.localPosition = startPos;
	paperDisplayObject.localScale = startScale;
	
	paperDisplayParticles.transform.localPosition = particleStartPos;
	
	// --
	
	paperDisplayObject.renderer.material = currentPaperMaterial;
	
	paperDisplayObject.renderer.enabled = true;
	paperDisplayLight.enabled = true;
	paperDisplayParticles.emit = true;
	
	// --
	
	var scaleTimer : float = 0.0;
	//var scaleTimerMax : float = 2.5;
	
	var isScaling : boolean = true;
	
	while ( isScaling )
	{
		scaleTimer += Time.deltaTime;
		
		if ( scaleTimer > scaleTimerMax )
		{
			isScaling = false;
		}
		
		var scaleFactor : float = ( scaleTimerMax - scaleTimer ) / scaleTimerMax;
		
		paperDisplayObject.localScale.y = startScale.y * scaleFactor;
		
		// setting the scale
		var newPosY : float = startPos.y + ( ( startScale.y * 0.5 ) - ( paperDisplayObject.localScale.y * 0.5 ) );
		
		// adjusting the position
		paperDisplayObject.localPosition.y = newPosY;
		
		paperDisplayParticles.transform.localPosition.y = particleStartPos.y + ( startScale.y - paperDisplayObject.localScale.y );
		
		// retile the texture
		currentPaperMaterial.mainTextureScale = Vector2( 1.0, scaleFactor ); // change the scaling of the texture
		currentPaperMaterial.SetTextureOffset( "_MainTex", Vector2( 0.0, 1.0 - scaleFactor ) ); // change the UV positions of the texture
		
		// next frame
		yield;
	}
	
	// --
	
	// effect is over, 
	// reset the light and renderer
	paperDisplayObject.renderer.enabled = false;
	paperDisplayLight.enabled = false;
	paperDisplayParticles.emit = false;
	
	currentPaperMaterial.mainTextureScale = Vector2.one;
	currentPaperMaterial.SetTextureOffset( "_MainTex", Vector2.zero );
}
