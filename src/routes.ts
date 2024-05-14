import axios from "axios";
import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from 'express-rate-limit'
import NodeCache from 'node-cache'
import 'dotenv/config'

const app: Express = express();
app.use(helmet());
const rateLimits = 50
const cache = new NodeCache({ stdTTL: 60 * 60 });
const apiKey = process.env.apiKey

const rateLimiterIpstack = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: rateLimits,
});
const rateLimiterIpapi = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: rateLimits,
});

const rateLimitAndCache = async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.params.ip;

    const cachedCountry = cache.get(ip);
    if (cachedCountry) {
        return next();
    }

    return rateLimiterIpstack(req, res, (err) => {
        if (err) {
            return rateLimiterIpapi(req, res, next);
        }
        return rateLimiterIpapi(req, res, next);
    });
};

app.get('/api/ip-to-country/:ip', cors(), rateLimitAndCache, async (req, res) => {
    const ip = req.params.ip;

    const cachedCountry = cache.get(ip);
    if (cachedCountry) {
        return res.json({ country: cachedCountry });
    }

    try {
        const response = await axios.get(`http://api.ipstack.com/${ip}?access_key=${apiKey}`);
        if (!response.data.success) {
            throw Error
        }
        const countryName = response.data.country_name;
        cache.set(ip, countryName);

        return res.json({ country: countryName });
    } catch (error) {
        try {
            const response = await axios.get(`https://ipapi.co/${ip}/json/`);
            const countryInfo = response.data;

            if (countryInfo.error) {
                return res.status(400).json({ error: countryInfo.reason });
            }
            cache.set(ip, countryInfo.country_name);
            return res.json({ country: countryInfo.country_name });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to get country name' });
        }
    }
});

export default app;
