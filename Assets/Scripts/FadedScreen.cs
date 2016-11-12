using UnityEngine;
using System.Collections;

public class FadedScreen : MonoBehaviour {

	private Texture2D fadedTexture;

	// Use this for initialization
	void Start () {
		fadedTexture = new Texture2D (Screen.width, Screen.height);

		float alpha = 1.0f;
		float reduce = 0.001f;
		float offset = 0;
		for (int i = 0; i < fadedTexture.height / 2; i++) {
			for (int j = 0; j < fadedTexture.width / 2 - (int) offset; j++) {
				fadedTexture.SetPixel (j, i, new Color (0.0f, 0.0f, 0.0f, alpha));
			}
			for (int j = fadedTexture.width / 2 + (int) offset; j < fadedTexture.width; j++) {
				fadedTexture.SetPixel (j, i, new Color (0.0f, 0.0f, 0.0f, alpha));
			}

			float alphaCopy = alpha;
			for (int j = fadedTexture.width / 2 - (int) offset; j < fadedTexture.width / 2; j++) {
				fadedTexture.SetPixel (j, i, new Color (0.0f, 0.0f, 0.0f, alphaCopy));
				alphaCopy -= reduce;
			}

			for (int j = fadedTexture.width / 2; j < fadedTexture.width / 2 + (int) offset; j++) {
				fadedTexture.SetPixel (j, i, new Color (0.0f, 0.0f, 0.0f, alphaCopy));
				alphaCopy += reduce;
			}

			offset = Mathf.Sqrt((Mathf.Pow((fadedTexture.height / 2), 2) - Mathf.Pow(fadedTexture.height / 2 - i, 2)));
			alpha -= reduce;
		}

		alpha = 1.0f;
		for (int i = fadedTexture.height; i >= fadedTexture.height / 2; i--) {
			for (int j = 0; j < fadedTexture.width / 2 - (int) offset; j++) {
				fadedTexture.SetPixel (j, i, new Color (0.0f, 0.0f, 0.0f, alpha));
			}
			for (int j = fadedTexture.width / 2 + (int) offset; j < fadedTexture.width; j++) {
				fadedTexture.SetPixel (j, i, new Color (0.0f, 0.0f, 0.0f, alpha));
			}

			float alphaCopy = alpha;
			for (int j = fadedTexture.width / 2 - (int) offset; j < fadedTexture.width / 2; j++) {
				fadedTexture.SetPixel (j, i, new Color (0.0f, 0.0f, 0.0f, alphaCopy));
				alphaCopy -= reduce;
			}

			for (int j = fadedTexture.width / 2; j < fadedTexture.width / 2 + (int) offset; j++) {
				fadedTexture.SetPixel (j, i, new Color (0.0f, 0.0f, 0.0f, alphaCopy));
				alphaCopy += reduce;
			}

			offset = Mathf.Sqrt((Mathf.Pow((fadedTexture.height / 2), 2) - Mathf.Pow(fadedTexture.height / 2 - i, 2)));
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
