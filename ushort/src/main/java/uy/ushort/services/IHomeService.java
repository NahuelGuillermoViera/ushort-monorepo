package uy.ushort.services;

import uy.ushort.data.LargeURLResponse;
import uy.ushort.data.LinkRequest;
import uy.ushort.data.LinkResponse;

import java.util.List;

public interface IHomeService {
    public List<LinkResponse> homeResponse();
    public LargeURLResponse getLargeURL(String path);
    public LinkResponse create(LinkRequest url);
}
