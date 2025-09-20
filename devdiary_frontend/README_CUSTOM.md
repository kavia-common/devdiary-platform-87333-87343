# DevDiary Frontend (Angular)

Ocean Professional themed responsive UI with:
- Top bar (quick actions / profile)
- Left side navigation
- Central daily log workspace
- Right sidebar passive activity feed
- Routes for Diary, Summaries, Integrations, Dashboard

Development:
- Start: npm start (ng serve) at http://localhost:3000
- API: Calls are made to /api and proxied to http://localhost:8080 via proxy.conf.json
- To point to another backend at runtime, set window.__DEV_DIARY_API__ in index.html.
```html
<script>window.__DEV_DIARY_API__ = 'https://backend.example.com';</script>
```
