//------------------------------//
//  PlayerHealth.js             //
//  Written by Alucard Jay      //
//  5/10/2013                   //
//------------------------------//

#pragma strict

var health : float = 100.0;
var healthDecayRate : float = 5.0;
private var healthDecayRateModifier : float = 5.0;

private var startingHealth : float;
private var decayModifier : float;

var staticRenderer : Renderer;


function Start() 
{
	startingHealth = health;
	
	decayModifier = startingHealth / healthDecayRate;
	
	healthDecayRateModifier = ( healthDecayRate - 0.6 ) / 7.0;
	
	if ( !staticRenderer )
	{
		Debug.LogWarning( "No Static Renderer Object in the Inspector" );
		
		var staticObject : GameObject = GameObject.Find( "StaticObject" );
		
		if ( staticObject )
		{
			staticRenderer = staticObject.renderer;
		}
		else
		{
			Debug.LogWarning( "No StaticObject found ...." );
		}
	}
	
	staticRenderer.material.color.a = 0.0;
}


function DecreaseHealth() 
{
	health -= decayModifier * Time.deltaTime;
	
	// calculate the alpha
	var newAlpha : float = 1.0 - (health / startingHealth);
	
	staticRenderer.material.color.a = newAlpha;
	
	// check if health is below 0
	if ( health <= 0.0 )
	{
		health = 0.0;
		
		Debug.Log( "Player is OUT OF HEALTH" );
		
		// lose condition
		
		// load game over scene
		Application.LoadLevel( "SceneLose" );
	}
	
	OffsetMainTexture();
}


function IncreaseHealth() 
{
	health += decayModifier * Time.deltaTime;
	
	// calculate the alpha
	var newAlpha : float = 1.0 - (health / startingHealth);
	
	staticRenderer.material.color.a = newAlpha;
	
	// check if health is above startingHealth
	if ( health >= startingHealth )
	{
		health = startingHealth;
	}
	
	OffsetMainTexture();
}


function DecreaseHealthDecayRate()
{
	healthDecayRate -= healthDecayRateModifier;
	
	decayModifier = startingHealth / healthDecayRate;
}


function OffsetMainTexture() 
{
	var rndXoffset : float = Random.value;
	var rndYoffset : float = Random.value;
	
	staticRenderer.material.mainTextureOffset = Vector2( rndXoffset, rndYoffset );
}
