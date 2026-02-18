package uy.ushort.services;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import uy.ushort.data.LargeURLResponse;
import uy.ushort.data.LinkRequest;
import uy.ushort.data.LinkResponse;
import uy.ushort.models.Link;
import uy.ushort.repositories.LinkRepository;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.List;

@Service
public class HomeServiceImpl implements IHomeService{

    @Autowired
    private LinkRepository linkRepository;
    @Autowired
    private IQRService qrService;

    @Value("${cors.allowed-origins}")
    private String link;

    @Override
    public List<LinkResponse> homeResponse() {
        List<Link> linkList = linkRepository.findAll();

        List<LinkResponse> response = new ArrayList<>();

        for (Link link : linkList) {
            LinkResponse data = new LinkResponse();

            data.setId(link.getId());
            data.setLongLink(link.getLongLink());
            data.setShortPath(link.getShortPath());
            data.setClicks(link.getClicks());

            response.add(data);
        }

        return response;
    }

    @Override
    public LargeURLResponse getLargeURL(String path) {
        Link link = linkRepository.findByShortPath(path).orElseThrow(() ->
                new RuntimeException("Link no encontrado")
        );
        incrementClicks(link);

        return new LargeURLResponse(link.getLongLink());
    }

    public LinkResponse create(LinkRequest url, int width, int height) {
        String shortPath = "";
        boolean unique = false;
        while(!unique) {
            shortPath = generateLinkPath();
            unique = !linkRepository.existsByShortPath(shortPath);
        }

        Link link = new Link();
        link.setLongLink(url.getUrl());
        link.setShortPath(shortPath);
        link.setClicks(0);

        LinkResponse response = new LinkResponse();



        response.setId(linkRepository.saveAndFlush(link).getId());
        response.setLongLink(link.getLongLink());
        response.setShortPath(link.getShortPath());
        response.setClicks(link.getClicks());


        return response;
    }

    private String generateLinkPath() {
        String randomCharacterSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuwxyz123456789";
        String result = "";
        for (int i=1; i <= 8; i++) {
            int x = (int)Math.round(Math.random()*(randomCharacterSet.length()-1));
            result += randomCharacterSet.charAt(x);
        }

        return result;
    }

    private void incrementClicks(Link link) {
        link.incrementClicks();
        linkRepository.save(link);
    }


    @Cacheable(
            value = "qrCache",
            key = "#code"
    )
    @Override
    public byte[] generateQr (String code) {

        try {
            return qrService.generateQRCode(link+"/r/"+code);
        } catch (Exception e) {
            throw new RuntimeException("Error generating QR", e);
        }

    }
}
