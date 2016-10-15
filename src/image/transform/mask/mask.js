import Image from '../../Image';
import {methods} from './maskAlgorithms';
import {getThreshold} from '../../../util/converter';

/**
 * Creation of binary mask is based on the determination of a threshold
 * You may either choose among the provided algorithm or just specify a threshold value
 * @memberof Image
 * @instance
 * @param {Object} [options]
 * @param {string} [options.algorithm='threshold']
 * @param {number} [options.threshold=0.5] - If the algorithm is 'threshold' specify here the value (0 to 1).
 * @param {boolean} [options.useAlpha=true] - Apply the alpha channel to determine the intensity of the pixel.
 * @param {boolean} [options.invert=false] - Invert the resulting image
 * @returns {Image} - Binary image containing the mask
 */
export default function mask(options = {}) {
    let {
        algorithm = 'threshold',
        threshold = 0.5,
        useAlpha = true,
        invert = false
    } = options;

    this.checkProcessable('mask', {
        components: 1,
        bitDepth: [8, 16]
    });

    if (algorithm === 'threshold') {
        threshold = getThreshold(threshold, this.maxValue);
    } else {
        let method = methods[algorithm.toLowerCase()];
        if (method) {
            let histogram = this.getHistogram();
            threshold = method(histogram, this.size);
        } else {
            throw new Error('mask transform unknown algorithm: ' + algorithm);
        }
    }

    let newImage = new Image(this.width, this.height, {
        kind: 'BINARY',
        parent: this
    });

    let ptr = 0;
    if (this.alpha && useAlpha) {
        for (let i = 0; i < this.data.length; i += this.channels) {
            let value = this.data[i] + (this.maxValue - this.data[i]) * (this.maxValue - this.data[i + 1]) / this.maxValue;
            if ((invert && value <= threshold) || (!invert && value >= threshold)) {
                newImage.setBit(ptr);
            }
            ptr++;
        }
    } else {
        for (let i = 0; i < this.data.length; i += this.channels) {
            if ((invert && this.data[i] <= threshold) || (!invert && this.data[i] >= threshold)) {
                newImage.setBit(ptr);
            }
            ptr++;
        }
    }

    return newImage;
}
