<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/6a0c8b31-bea7-4e93-ba2b-fb35fcdffcfb

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Add Firebase settings to `.env.local` if cloud data sync is needed.
3. Run the app:
   `npm run dev`

## Hospital AI Assistant

The assistant runs entirely in the visitor's browser without an AI API, API key, or per-message network request. It searches the current public doctor, diagnostic test, notice, blog, and management data, and provides guided answers for common contact, appointment, service, and location questions in Bengali or English (including common Banglish questions). It is a website information helper, not a generative AI model; questions outside its supported knowledge are answered with a prompt to ask more specifically or contact the hospital.
