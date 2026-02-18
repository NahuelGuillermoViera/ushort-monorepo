package uy.ushort.controllers;

import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.DigestUtils;
import org.springframework.web.bind.annotation.*;
import uy.ushort.data.LinkRequest;
import uy.ushort.data.LinkResponse;
import uy.ushort.services.IHomeService;
import uy.ushort.services.IQRService;

import javax.print.attribute.standard.Media;
import java.net.URI;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api")
public class HomeController {
    @Autowired
    private IHomeService homeService;

    @GetMapping("/")
    public ResponseEntity<?> homeResponse() {
        return ResponseEntity.ok(homeService.homeResponse());
    }

    @PostMapping("/create")
    public LinkResponse create(@RequestBody LinkRequest url, @RequestParam(defaultValue = "50") int width, @RequestParam(defaultValue = "50") int height) {
        return homeService.create(url, width, height);
    }

    @GetMapping("/r/{path}")
    public ResponseEntity<Void> redirect(@PathVariable String path) {

        String largeUrl = homeService.getLargeURL(path).getLargeURL();

        return ResponseEntity
                .status(HttpStatus.FOUND)
                .location(URI.create(largeUrl))
                .build();
    }

    @GetMapping(value = "/qr/{code}", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> getQr(@PathVariable String code) throws Exception {
        byte [] qrImage = homeService.generateQr(code);

        String eTag = "\"" + DigestUtils.md5DigestAsHex(code.getBytes()) + "\"";

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .cacheControl(CacheControl.maxAge(1, TimeUnit.DAYS).cachePublic())
                .eTag(eTag)
                .body(qrImage);
    }
}