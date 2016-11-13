using UnityEngine;
using UnityEngine.UI;
using System.Collections;
using System;
public class TestingAudioCameraEvent : MonoBehaviour {
    public AudioClip[] voiceClips;
    public AudioClip noise1;
    public AudioSource sounds;
    public int hasBeenActivated = 0;
    public float previousTime = 0;
    public float newTime = 0;
	public GameObject objectLook;
	public GameObject myLook;
	public Button shootBullet;
	private int trumpLives;
	public Text howManyLives;
	public Text howMuchFilm;
	private int filmCount;
	public GameObject deletTrump;
	public GameObject deletAudioTrump;
	public GameObject winScreen;
    void Start() {
        sounds = GetComponent<AudioSource>();
        voiceClips = Resources.LoadAll<AudioClip>("Sound");
        noise1 = voiceClips[0];
		objectLook = GameObject.Find("EthanBody");
		myLook = GameObject.Find("Tango AR Camera");
		Button btn = shootBullet.GetComponent<Button> ();
		btn.onClick.AddListener (TaskOnClick);
		trumpLives = 3;
		howManyLives.text = trumpLives.ToString ();
		filmCount = Convert.ToInt32(howMuchFilm.text);
    }
    void Update() {

        Vector3 dirFromMeToObject = (objectLook.transform.position - myLook.transform.position).normalized;
        Vector3 myCurrentFacingDir = transform.forward;
        if (Vector3.Dot(dirFromMeToObject, myCurrentFacingDir) > 0.75 && hasBeenActivated == 0) {
            Debug.Log("object is with a 45 degree arc in front of us");
            noise1 = voiceClips[UnityEngine.Random.Range(0, voiceClips.Length)];
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
	void TaskOnClick () {
		Vector3 dirFromMeToObject = (objectLook.transform.position - myLook.transform.position).normalized;
		Vector3 myCurrentFacingDir = transform.forward;
		filmCount = Convert.ToInt32(howMuchFilm.text);
		if (Vector3.Dot (dirFromMeToObject, myCurrentFacingDir) > 0.95 && filmCount != 0) {
			Debug.Log ("object is narrow!");
			trumpLives = trumpLives - 1;
			filmCount = filmCount - 1;
			howManyLives.text = trumpLives.ToString ();
			howMuchFilm.text = filmCount.ToString ();
			if (filmCount == 0) {
				deletTrump.SetActive (false);
				deletAudioTrump.SetActive (false);
				winScreen.SetActive (true);
			}
		} else if (filmCount != 0) {
			filmCount = filmCount - 1;
			howMuchFilm.text = filmCount.ToString ();
		}
	}
 }