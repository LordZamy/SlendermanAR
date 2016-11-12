using UnityEngine;
using System.Collections;
public class TestingAudioCameraEvent : MonoBehaviour {
    public AudioClip[] voiceClips;
    public AudioClip noise1;
    public AudioSource sounds;
    public int hasBeenActivated = 0;
    public float previousTime = 0;
    public float newTime = 0;
	public GameObject objectLook;
	public GameObject myLook;
    void Start() {
        sounds = GetComponent<AudioSource>();
        voiceClips = Resources.LoadAll<AudioClip>("Sound");
        noise1 = voiceClips[0];
		objectLook = GameObject.Find("EthanBody");
		myLook = GameObject.Find("Tango AR Camera");
    }
    void Update() {

        Vector3 dirFromMeToObject = (objectLook.transform.position - myLook.transform.position).normalized;
        Vector3 myCurrentFacingDir = transform.forward;
        if (Vector3.Dot(dirFromMeToObject, myCurrentFacingDir) > 0.75 && hasBeenActivated == 0) {
            Debug.Log("object is with a 45 degree arc in front of us");
            noise1 = voiceClips[Random.Range(0, voiceClips.Length)];
            sounds.PlayOneShot(noise1, 1);
            hasBeenActivated =1;
            previousTime = Time.time;
        }
        if (hasBeenActivated == 1) {
            newTime = Time.time;
            if (newTime - previousTime > 4) {
                hasBeenActivated = 0;
            }
        }


    }
 }