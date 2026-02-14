package uy.ushort.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uy.ushort.data.LinkRequest;
import uy.ushort.data.LinkResponse;
import uy.ushort.services.IHomeService;

import java.net.URI;

@RestController
public class HomeController {
    @Autowired
    private IHomeService homeService;

    @GetMapping("/")
    public ResponseEntity<?> homeResponse() {
        return ResponseEntity.ok(homeService.homeResponse());
    }

    @PostMapping("/create")
    public LinkResponse create(@RequestBody LinkRequest url) {
        return homeService.create(url);
    }

    @GetMapping("/r/{path}")
    public ResponseEntity<Void> redirect(@PathVariable String path) {

        String largeUrl = homeService.getLargeURL(path).getLargeURL();

        return ResponseEntity
                .status(HttpStatus.FOUND)
                .location(URI.create(largeUrl))
                .build();
    }
}