//------------------------------//
//  MenuMouseLookScript.js      //
//  Written by Alucard Jay      //
//  5/6/2013                    //
//------------------------------//

#pragma strict

var xSpeed : float = 1.0;
var ySpeed : float = 1.0;

var xMinLimit : float = -55.0;
var xMaxLimit : float = 55.0;

var yMinLimit : float = -35.0;
var yMaxLimit : float = 25.0;

private var rotX : float;
private var rotY : float;
private var rotZ : float;

private var cameraTransform : Transform;
private var lastHitObject : GameObject;

var selectedColour : Color;
var deselectedColour : Color;

var lastMousePos : Vector3;

public var fadeObject : Renderer;

var isFading : boolean = false;

public var fadeTime : float = 1.5;
private var timer : float = 0.0;


function Start() 
{
	cameraTransform = transform;
	
	rotX = rotY = rotZ = 0.0;
	cameraTransform.localRotation = Quaternion.identity;
	
	lastMousePos = Input.mousePosition;
	
	if ( !fadeObject )
	{
		Debug.LogWarning( "No paper Display Object in the Inspector" );
		fadeObject = GameObject.Find( "FadeObject" ).renderer;
	}
	
	//fadeObject.material.color = Color( 0, 0, 0, 0 );
	fadeObject.material.color.a = 0.0;
}


function Update() 
{
	if ( !isFading )
	{
		var hit : RaycastHit;
		
		if ( Physics.Raycast( cameraTransform.position, cameraTransform.forward, hit, 100.0 ) )
		{
			if ( hit.collider.gameObject.tag == "Player" )
			{
				if ( lastHitObject )
				{
					if ( lastHitObject.name != hit.collider.gameObject.name )
					{
						// return old object colour to deselected
						lastHitObject.renderer.material.color = deselectedColour;
						
						// store new hit object
						lastHitObject = hit.collider.gameObject;
						
						// setting new object to selected
						lastHitObject.renderer.material.color = selectedColour;
					}
				}
				else
				{
					lastHitObject = hit.collider.gameObject;
						
					// setting new object to selected
					lastHitObject.renderer.material.color = selectedColour;
				}
				
				if ( Input.GetMouseButtonDown(0) )
				{
					//Debug.Log( hit.collider.gameObject.name );
					
					switch( hit.collider.gameObject.name )
					{
						case "BtnMainMenu" :
						
							//Application.LoadLevel( "SceneMainMenu" );
							FadeAndLoadLevel( "SceneMainMenu" );
							
						break;
						
						case "BtnOptions" :
						
							Debug.Log( "No OPTIONS menu yet !" );
							//Application.LoadLevel( "Options" );
							//FadeAndLoadLevel( "Options" );
							
						break;
						
						case "BtnPlay" :
						
							//Application.LoadLevel( "GAME" );
							FadeAndLoadLevel( "GAME" );
							
						break;
						
						case "BtnQuit" :
						
							// QUIT DOES NOT WORK IN EDITOR OR WEB BUILD
							Application.Quit();
							#if UNITY_EDITOR
							Debug.Log( "QUIT DOES NOT WORK IN EDITOR OR WEB BUILD" );
							#endif
							
						break;
					}
				}
			}
			else
			{
				if ( lastHitObject )
				{
					lastHitObject.renderer.material.color = deselectedColour;
					lastHitObject = null;
				}
			}
		}
		else
		{
			if ( lastHitObject )
			{
				lastHitObject.renderer.material.color = deselectedColour;
				lastHitObject = null;
			}
		}
	}
}


function LateUpdate() 
{
	//
	rotY += Input.GetAxis( "Mouse X" ) * xSpeed; // this is for horizontal mouse movement, rotate on camera Y axis
	rotX -= Input.GetAxis( "Mouse Y" ) * ySpeed; // this is for vertical mouse movement, rotate on camera X axis
	
	rotY = ClampRotation( rotY, xMinLimit, xMaxLimit );
	rotX = ClampRotation( rotX, -yMaxLimit, -yMinLimit );
	
	cameraTransform.localRotation = Quaternion.Euler( rotX, rotY, rotZ );
}


function FadeAndLoadLevel( theLevel : String ) 
{
	isFading = true;
	
	// Fade Out
	while ( timer < fadeTime )
	{
		timer += Time.deltaTime;
		
		var fadeAmt : float = timer / fadeTime;
		
		//fadeObject.material.color = Color( 1.0 - fadeAmt, 1.0 - fadeAmt, 1.0 - fadeAmt, fadeAmt );
		fadeObject.material.color.a = fadeAmt;
		
		yield;
	}
	
	
	// Load Level
	Application.LoadLevel( theLevel );
}


function ClampRotation( theRot : float, minRot : float, maxRot : float ) : float
{
	if ( theRot < -360.0 )
	{
		theRot += 360.0;
	}
	else if ( theRot > 360.0 )
	{
		theRot -= 360.0;
	}
	
	theRot = Mathf.Clamp( theRot, minRot, maxRot );
	
	return theRot;
}
