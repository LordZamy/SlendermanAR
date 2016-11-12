//------------------------------//
//  MusicManager.js             //
//  Written by Alucard Jay      //
//  5/10/2013                   //
//------------------------------//

#pragma strict
@script RequireComponent( AudioSource )

var musicClips : AudioClip[];


function Start() 
{
	if( musicClips.Length < 4 )
	{
		Debug.LogWarning( "Need 4 Music Tracks in the Inspector" );
	}
	
	audio.loop = true;
	audio.clip = musicClips[ 0 ];
	audio.Play();
}


function PlayMusicTrack( trackNumber : int ) 
{
	audio.Stop();
	audio.clip = musicClips[ trackNumber ];
	audio.Play();
}
