//------------------------------//
//  SceneLoseEffect.js          //
//  Written by Alucard Jay      //
//  5/13/2013                   //
//------------------------------//

#pragma strict

public var enemyObject : Transform;

public var staticObject : Renderer;

public var btnMainMenu : Renderer;
public var btnOptions : Renderer;
public var btnQuit : Renderer;
public var labelTitle : Renderer;

enum loseMenuState
{
	SceneLoaded,
	EnemyAppear,
	EnemyDisappear,
	StaticGoRed,
	StaticFadeAway,
	WaitingForInput
}

var currState : loseMenuState;


// timers

var timer : float = 0.0;

var enemyAppearTime : float = 1.5;
var staticGoRedTime : float = 2.0;
var staticFadeAwayTime : float = 2.0;

var enemyAppearSpeed : float = 1.5;



function Start() 
{
	if ( !enemyObject )
	{
		Debug.LogWarning( "No Enemy Object in the Inspector" );
		enemyObject = GameObject.Find( "golem" ).transform;
	}
	
	if ( !staticObject )
	{
		Debug.LogWarning( "No Static Object in the Inspector" );
		staticObject = GameObject.Find( "StaticObject" ).renderer;
	}
	
	staticObject.material.color.a = 1.0;
	
	
	if ( !btnMainMenu )
	{
		Debug.LogWarning( "No btnMainMenu in the Inspector" );
		btnMainMenu = GameObject.Find( "BtnMainMenu" ).renderer;
	}
	
	if ( !btnOptions )
	{
		Debug.LogWarning( "No btnOptions in the Inspector" );
		btnOptions = GameObject.Find( "BtnOptions" ).renderer;
	}
	
	if ( !btnQuit )
	{
		Debug.LogWarning( "No btnQuit in the Inspector" );
		btnQuit = GameObject.Find( "BtnQuit" ).renderer;
	}
	
	if ( !labelTitle )
	{
		Debug.LogWarning( "No labelTitle in the Inspector" );
		labelTitle = GameObject.Find( "Title" ).renderer;
	}
	
	ShowMenuItems( false );
	
	timer = 0.0;
	
	currState = loseMenuState.EnemyAppear;
}


function Update() 
{
	OffsetMainTexture();
	
	timer += Time.deltaTime;
	
	var fadeAmt : float;
	
	switch( currState )
	{
		case loseMenuState.EnemyAppear :
			
			// move enemy forward at rate of enemyAppearSpeed
			enemyObject.localPosition.z -= enemyAppearSpeed * Time.deltaTime;
			
			if ( timer > enemyAppearTime )
			{
				timer = 0.0;
				
				currState = loseMenuState.EnemyDisappear;
			}
			
		break;
		
		case loseMenuState.EnemyDisappear :
			
			// move enemy far away (behind camera is good enough)
			enemyObject.localPosition.z = -10.0;
			
			// reset the timer just to be sure
			timer = 0.0;
			
			currState = loseMenuState.StaticGoRed;
			
		break;
		
		case loseMenuState.StaticGoRed :
			
			fadeAmt = timer / staticGoRedTime;
			
			staticObject.material.color.b = 1.0 - fadeAmt;
			staticObject.material.color.g = 1.0 - fadeAmt;
			
			if ( timer > staticGoRedTime )
			{
				timer = 0.0;
				
				// move the static forward of the buttons
				staticObject.transform.localPosition.z = 0.6;
				staticObject.transform.localScale = Vector3( 0.2, 1.0, 0.15 );
				
				// show the menu items
				ShowMenuItems( true );
				
				currState = loseMenuState.StaticFadeAway;
			}
			
		break;
		
		case loseMenuState.StaticFadeAway :
			
			fadeAmt = timer / staticFadeAwayTime;
			
			staticObject.material.color.a = 1.0 - fadeAmt;
			
			if ( timer > staticFadeAwayTime )
			{
				timer = 0.0;
				
				currState = loseMenuState.WaitingForInput;
			}
			
		break;
	}
}


function OffsetMainTexture() 
{
	var rndXoffset : float = Random.value;
	var rndYoffset : float = Random.value;
	
	staticObject.material.mainTextureOffset = Vector2( rndXoffset, rndYoffset );
}


function ShowMenuItems( theBool : boolean ) 
{
	btnMainMenu.enabled = theBool;
	btnOptions.enabled = theBool;
	btnQuit.enabled = theBool;
	labelTitle.enabled = theBool;
	
	// change the collider state also
	btnMainMenu.gameObject.collider.enabled = theBool;
	btnOptions.gameObject.collider.enabled = theBool;
	btnQuit.gameObject.collider.enabled = theBool;
}


// Debug.Log( " " +  + " :  " +  );
