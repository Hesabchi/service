import ExpressRateLimit from 'express-rate-limit'

export const apiLimiter = ExpressRateLimit({
    windowMs:  (60 * 1000) * 1 , // 10 minutes
    max: 30, // Limit each IP to 100 requests per `window`
    message: "Too many request, please try again later"
})
