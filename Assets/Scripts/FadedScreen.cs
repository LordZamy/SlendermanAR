using UnityEngine;
using System.Collections;

public class FadedScreen : MonoBehaviour {

	private Texture2D fadedTexture;

	// Use this for initialization
	void Start () {
		fadedTexture = new Texture2D (Screen.width, Screen.height);

		float alpha = 1.0f;
		float reduce = alpha / fadedTexture.height;
		for (int y = 0; y < fadedTexture.height / 2; y++) {
			for (int x = y; x < fadedTexture.width - y; x++) {
				fadedTexture.SetPixel (x, y, new Color (0.0f, 0.0f, 0.0f, alpha));
			}
				
			for (int x = y; x < fadedTexture.width - y; x++) {
				fadedTexture.SetPixel (x, fadedTexture.height - y, new Color (0.0f, 0.0f, 0.0f, alpha));
			}

			for (int x = y; x < fadedTexture.height - y; x++) {
				fadedTexture.SetPixel (y, x, new Color (0.0f, 0.0f, 0.0f, alpha));
			}

			for (int x = y; x < fadedTexture.height - y; x++) {
				fadedTexture.SetPixel (fadedTexture.width - y, x, new Color (0.0f, 0.0f, 0.0f, alpha));
			}

			alpha -= reduce;
		}

		fadedTexture.Apply ();
	}
	
	// Update is called once per frame
	void Update () {
	
	}

	void OnGUI () {
		GUI.DrawTexture (new Rect (0, 0, Screen.width, Screen.height), fadedTexture);
	}
}
