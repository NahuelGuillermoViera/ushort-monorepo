package uy.ushort.services;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.awt.image.RenderedImage;
import java.io.ByteArrayOutputStream;

@Service
public class QRServiceImpl implements IQRService{

    @Value("@Value(\"${cors.allowed-origins}\")")


    @Cacheable(
            value = "qrCache",
            key = "#code"
    )
    @Override
    public byte[] generateQRCode(String text) throws Exception {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE,200,200);

        BufferedImage bufferedImage = new BufferedImage(200,200, BufferedImage.TYPE_INT_RGB);
        bufferedImage.createGraphics().fillRect(0,0,200,200);
        Graphics2D graphic = (Graphics2D) bufferedImage.getGraphics();
        graphic.setColor(Color.BLACK);

        for(int x=0; x < 200; x++) {
            for(int y=0; y < 200; y++) {
                if (bitMatrix.get(x,y)) {
                    graphic.fillRect(x,y,1,1);
                }
            }
        }

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write((RenderedImage) bufferedImage, "png", baos);
        return baos.toByteArray();
    }
}
