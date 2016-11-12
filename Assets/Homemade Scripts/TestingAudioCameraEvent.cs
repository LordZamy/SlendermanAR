using UnityEngine;
using System.Collections;
public class TestingAudioCameraEvent : MonoBehaviour {
    public AudioClip[] voiceClips;
    public AudioClip noise1;
    public AudioSource sounds;
    void Start() {
        sounds = GetComponent<AudioSource>();
        voiceClips = Resources.LoadAll<AudioClip>("Sound");
        noise1 = voiceClips[0];
    }
    void Update() {
        var objectLook = GameObject.Find("Ethan");
        var myLook = GameObject.Find("Tango AR Camera");
        Vector3 dirFromMeToObject = (objectLook.transform.position - myLook.transform.position).normalized;
        Vector3 myCurrentFacingDir = transform.forward;
        if (Vector3.Dot(dirFromMeToObject, myCurrentFacingDir) > 0.75 && !sounds.isPlaying) {
            Debug.Log("object is with a 45 degree arc in front of us");
            sounds.PlayOneShot(noise1, 1);
        }
    }
 }