package uy.ushort.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Link {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String longLink;
    @Column(unique = true)
    private String shortPath;
    private int clicks;

    public void incrementClicks(){
        this.clicks += 1;
    }
}
