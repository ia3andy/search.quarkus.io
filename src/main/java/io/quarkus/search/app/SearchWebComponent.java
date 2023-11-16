package io.quarkus.search.app;

import io.quarkiverse.web.bundler.runtime.Bundle;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;
import org.jboss.resteasy.reactive.Cache;

import java.net.URI;
import java.net.URISyntaxException;

@Path("/")
public class SearchWebComponent {

    @Inject
    Bundle bundle;

    // This route allows to access the web-component js on a fixed path
    // without affecting caching of the script
    @Path("/quarkus-search.js")
    @Cache(noCache = true)
    @GET
    public Response script() {
        try {
            return Response.seeOther(new URI(bundle.script("main"))).build();
        } catch (URISyntaxException e) {
            throw new RuntimeException(e);
        }
    }
}
