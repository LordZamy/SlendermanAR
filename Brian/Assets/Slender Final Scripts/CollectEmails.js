#pragma strict
@script RequireComponent( AudioSource )

var emails : int = 0; // counter of how many emails collected
var emailsToWin : int = 8; // total number of emails in the scene

var distanceToemail : float = 5.5; // maximum distance that the raycast will detect
var sphereRadius : float = 1.0; // the width of the sphere that is being SphereCast

public var scaleTimerMax : float = 1.5; // how fast the email disappears

var emailSound : AudioClip;

var enemyScript : NPCMovement;

var musicManagerScript : MusicManager;


private var currentEmailMaterial : Material;

public var emailDisplayObject : Transform;
public var emailDisplayLight : Light;
public var emailDisplayParticles : ParticleEmitter;

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
    
    if ( !emailDisplayObject )
    {
        Debug.LogWarning( "No email Display Object in the Inspector" );
        emailDisplayObject = GameObject.Find( "emailDisplayObject" ).transform;
    }
    
    if ( !emailDisplayLight )
    {
        Debug.LogWarning( "No email Display Light in the Inspector" );
        emailDisplayLight = GameObject.Find( "emailViewSpotlight" ).light;
    }
    
    if ( !emailDisplayParticles )
    {
        Debug.LogWarning( "No email Display Particles in the Inspector" );
        emailDisplayParticles = GameObject.Find( "DustParticleEffect" ).particleEmitter;
    }
    
    emailDisplayObject.renderer.enabled = false;
    emailDisplayLight.enabled = false;
    emailDisplayParticles.emit = false;
    
    particleStartPos = emailDisplayParticles.transform.localPosition;
    
    startPos = emailDisplayObject.localPosition;
    startScale = emailDisplayObject.localScale;
}


function Update() 
{
    if ( Input.GetMouseButtonDown(0) || Input.GetKeyDown( KeyCode.E ) )
    {
        var hit : RaycastHit;
        
        var rayOrigin : Ray = Camera.main.ScreenPointToRay( Vector3( Screen.width * 0.5, Screen.height * 0.5, 0 ) );
        
        if ( Physics.SphereCast( rayOrigin, sphereRadius, hit, distanceToemail ) )
        {
            //Debug.Log( "SphereCast Hit : " + hit.collider.gameObject.name );
            //Debug.DrawLine( Camera.main.transform.position, hit.point, Color.red, 1.5 );
            
            if ( hit.collider.gameObject.name == "email" )
            {
                //Debug.Log( "SPHERE hit email for sure" );
                
                emails += 1;
                
                // play email has been picked up sound
                audio.PlayClipAtPoint( emailSound, hit.point );
                
                // destroy the email
                Destroy( hit.collider.gameObject );
                
                // tell enemy to follow closer
                enemyScript.ReduceDistance();
                
                // tell enemy to teleport now (if you want)
                enemyScript.TeleportEnemy();
                
                // tell the player they go mad quicker
                gameObject.SendMessage( "DecreaseHealthDecayRate", SendMessageOptions.RequireReceiver );
                
                // change the music based on the number of emails collected
                if ( emails == 2 )
                {
                    musicManagerScript.PlayMusicTrack( 1 );
                }
                else if ( emails == 4 )
                {
                    musicManagerScript.PlayMusicTrack( 2 );
                }
                else if ( emails == 6 )
                {
                    musicManagerScript.PlayMusicTrack( 3 );
                }
                else if ( emails == emailsToWin )
                {
                    Debug.Log( "You have collected All emails !" );
                    
                    // load Win Scene here !!!!
                    Application.LoadLevel( "SceneWin" );
                }
                
                // set current email material
                currentEmailMaterial = hit.collider.gameObject.renderer.material;
                
                DisplayEmail();
            }
            
        }
    }
}


function DisplayEmail() 
{
    // reset the size
    emailDisplayObject.localPosition = startPos;
    emailDisplayObject.localScale = startScale;
    
    emailDisplayParticles.transform.localPosition = particleStartPos;
    
    // --
    
    emailDisplayObject.renderer.material = currentEmailMaterial;
    
    emailDisplayObject.renderer.enabled = true;
    emailDisplayLight.enabled = true;
    emailDisplayParticles.emit = true;
    
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
        
        emailDisplayObject.localScale.y = startScale.y * scaleFactor;
        
        // setting the scale
        var newPosY : float = startPos.y + ( ( startScale.y * 0.5 ) - ( emailDisplayObject.localScale.y * 0.5 ) );
        
        // adjusting the position
        emailDisplayObject.localPosition.y = newPosY;
        
        emailDisplayParticles.transform.localPosition.y = particleStartPos.y + ( startScale.y - emailDisplayObject.localScale.y );
        
        // retile the texture
        currentEmailMaterial.mainTextureScale = Vector2( 1.0, scaleFactor ); // change the scaling of the texture
        currentEmailMaterial.SetTextureOffset( "_MainTex", Vector2( 0.0, 1.0 - scaleFactor ) ); // change the UV positions of the texture
        
        // next frame
        yield;
    }
    
    // --
    
    // effect is over, 
    // reset the light and renderer
    emailDisplayObject.renderer.enabled = false;
    emailDisplayLight.enabled = false;
    emailDisplayParticles.emit = false;
    
    currentEmailMaterial.mainTextureScale = Vector2.one;
    currentEmailMaterial.SetTextureOffset( "_MainTex", Vector2.zero );
}
