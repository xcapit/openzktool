# Deployment Instructions

This documentation site is built with Docusaurus and deployed to GitHub Pages.

## Enable GitHub Pages

To activate the documentation site at `https://xcapit.github.io/openzktool/`:

1. Go to your GitHub repository: https://github.com/xcapit/openzktool
2. Click **Settings** (top navigation)
3. Click **Pages** (left sidebar)
4. Under **Source**, select: **GitHub Actions**
5. Save the settings

## Automatic Deployment

The site automatically deploys when:
- You push changes to the `main` branch
- Files in `docs-site/` are modified
- The `.github/workflows/deploy-docs.yml` workflow runs

## Manual Deployment

To deploy manually:

```bash
cd docs-site
npm run build
npm run deploy
```

## Local Development

To preview the site locally:

```bash
cd docs-site
npm install
npm start
```

This opens http://localhost:3000 with live reload.

## Build Production

To build for production:

```bash
cd docs-site
npm run build
```

The output will be in `docs-site/build/`

## Verify Deployment

After enabling GitHub Pages, wait 2-3 minutes then visit:
https://xcapit.github.io/openzktool/

## Troubleshooting

### 404 Error

If you see a 404 error:
1. Ensure GitHub Pages is set to "GitHub Actions" source
2. Check that the workflow ran successfully in the "Actions" tab
3. Wait a few minutes for DNS propagation

### Build Failures

Check the GitHub Actions logs:
1. Go to repository → Actions tab
2. Click on the latest "Deploy Documentation" workflow
3. Review error messages in the build logs

## Custom Domain (Optional)

To use a custom domain:
1. Add a CNAME file in `docs-site/static/CNAME` with your domain
2. Configure DNS settings with your domain provider
3. Enable HTTPS in GitHub Pages settings
