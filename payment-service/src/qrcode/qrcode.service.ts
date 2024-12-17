// eslint-disable-next-line @typescript-eslint/naming-convention
import QRCode from 'qrcode';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class QRCodeService {
  async generateQRCode(data: {
    userId: string;
    orderId: string;
    paymentId: string;
  }): Promise<string> {
    const logger = new Logger(QRCodeService.name);

    logger.log(`Generating QR code for order ID ${data.orderId}`);
    return await QRCode.toDataURL(data.orderId, { errorCorrectionLevel: 'H' });
  }
}
