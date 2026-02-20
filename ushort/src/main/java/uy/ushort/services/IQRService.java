package uy.ushort.services;

import java.awt.image.BufferedImage;

public interface IQRService {
    byte[] generateQRCode(String text) throws Exception;
}
