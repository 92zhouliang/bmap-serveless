// 是否生产
const isProd = process.env.isProd === 1;

const ossClientTimeout = process.env.ossClientTimeout || 1000 * 60 *30;
module.exports ={
    isProd,
    ossClientTimeout
}