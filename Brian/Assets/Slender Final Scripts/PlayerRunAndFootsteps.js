//------------------------------//
//  PlayerRunAndFootsteps.js    //
//  Written by Alucard Jay      //
//  5/10/2013                   //
//------------------------------//

#pragma strict
@script RequireComponent( AudioSource )
 
var walkSounds : AudioClip[];
var runSounds : AudioClip[];
 
var walkAudioSpeed : float = 0.4;
var runAudioSpeed : float = 0.2;
 
private var walkAudioTimer : float = 0.0;
private var runAudioTimer : float = 0.0;
 
var isWalking : boolean = false;
var isRunning : boolean = false;
 
var walkSpeed: float = 8; // regular speed
var runSpeed: float = 20; // run speed
 
private var chCtrl : CharacterController;
private var chMotor : CharacterMotor;
 
function Start()
{
	chCtrl = GetComponent( CharacterController );
	chMotor = GetComponent( CharacterMotor );
}
 
function Update()
{
	SetSpeed();
	 
	if ( chCtrl.isGrounded )
	{
		PlayFootsteps();
	}
	else
	{
		walkAudioTimer = 1000.0;
		runAudioTimer = 1000.0;
	}
}
 
function SetSpeed()
{
	var speed = walkSpeed;
	 
	if ( chCtrl.isGrounded && Input.GetKey("left shift") || Input.GetKey("right shift") )
	{
		speed = runSpeed;
	}
	 
	chMotor.movement.maxForwardSpeed = speed;
}
 
function PlayFootsteps()
{
	if ( Input.GetAxis( "Horizontal" ) || Input.GetAxis( "Vertical" ) )
	{
		if ( Input.GetKey( "left shift" ) || Input.GetKey( "right shift" ) )
		{
			// Running
			isWalking = false;
			isRunning = true;
		}
		else
		{
			// Walking
			isWalking = true;
			isRunning = false;
		}
	}
	else
	{
		// Stopped
		isWalking = false;
		isRunning = false;
	}
	 
	// Play Audio
	if ( isWalking )
	{
		if ( walkAudioTimer > walkAudioSpeed )
		{
			audio.Stop();
			audio.clip = walkSounds[ Random.Range( 0, walkSounds.Length ) ];
			audio.Play();
			walkAudioTimer = 0.0;
		}
	}
	else if ( isRunning )
	{
		if ( runAudioTimer > runAudioSpeed )
		{
			audio.Stop();
			audio.clip = runSounds[ Random.Range( 0, runSounds.Length ) ];
			audio.Play();
			runAudioTimer = 0.0;
		}
	}
	else
	{
		audio.Stop();
	}
	 
	// increment timers
	walkAudioTimer += Time.deltaTime;
	runAudioTimer += Time.deltaTime;
}
