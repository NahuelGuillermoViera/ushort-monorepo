package uy.ushort.data;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LinkResponse {
    private Long id;
    private String longLink;
    private String shortPath;
    private int clicks;
}
