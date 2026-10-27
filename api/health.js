export default function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    app: 'HER JOURNEY 240 API',
    platform: 'Vercel Serverless',
    time: new Date().toISOString()
  });
}
