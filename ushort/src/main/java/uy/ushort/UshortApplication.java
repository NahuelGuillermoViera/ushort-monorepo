package uy.ushort;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.Cacheable;

@SpringBootApplication
@Cacheable
public class UshortApplication {

    public static void main(String[] args) {
        SpringApplication.run(UshortApplication.class, args);
    }

}
