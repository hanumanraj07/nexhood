import React, { useEffect, useRef, useState } from 'react';

let mapsScriptPromise = null;

const loadGoogleMapsScript = (apiKey) => {
  if (window.google?.maps) return Promise.resolve(window.google.maps);
  if (mapsScriptPromise) return mapsScriptPromise;

  mapsScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-google-maps="true"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(window.google?.maps));
      existing.addEventListener('error', reject);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMaps = 'true';
    script.onload = () => resolve(window.google?.maps);
    script.onerror = () => reject(new Error('Failed to load Google Maps script'));
    document.head.appendChild(script);
  });

  return mapsScriptPromise;
};

const GoogleMapView = ({ apiKey, center, zoom = 12, markers = [], style }) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRefs = useRef([]);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let mounted = true;
    if (!apiKey || !containerRef.current) return undefined;

    loadGoogleMapsScript(apiKey)
      .then(() => {
        if (!mounted || !containerRef.current) return;
        mapRef.current = new window.google.maps.Map(containerRef.current, {
          center,
          zoom,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        });
      })
      .catch((error) => {
        if (mounted) setLoadError(error.message || 'Failed to load map');
      });

    return () => {
      mounted = false;
    };
  }, [apiKey]);

  useEffect(() => {
    if (!mapRef.current || !window.google?.maps) return;
    mapRef.current.setCenter(center);
    mapRef.current.setZoom(zoom);
  }, [center, zoom]);

  useEffect(() => {
    if (!mapRef.current || !window.google?.maps) return;

    markerRefs.current.forEach((marker) => marker.setMap(null));
    markerRefs.current = [];

    const bounds = new window.google.maps.LatLngBounds();
    markers.forEach((entry) => {
      const marker = new window.google.maps.Marker({
        map: mapRef.current,
        position: entry.position,
        title: entry.title,
        icon: entry.color
          ? {
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: entry.color,
              fillOpacity: 0.95,
              strokeColor: '#ffffff',
              strokeWeight: 1.5,
              scale: entry.scale || 7,
            }
          : undefined,
      });

      if (entry.infoHtml) {
        const info = new window.google.maps.InfoWindow({ content: entry.infoHtml });
        marker.addListener('click', () => info.open({ anchor: marker, map: mapRef.current }));
      }

      if (typeof entry.onClick === 'function') {
        marker.addListener('click', entry.onClick);
      }

      markerRefs.current.push(marker);
      bounds.extend(entry.position);
    });

    if (markers.length > 1) {
      mapRef.current.fitBounds(bounds, 70);
    }
  }, [markers]);

  if (!apiKey) {
    return (
      <div style={{ ...style, display: 'grid', placeItems: 'center', color: '#9ca3af', fontWeight: 700 }}>
        Missing `VITE_GOOGLE_MAPS_API_KEY` in client environment.
      </div>
    );
  }

  if (loadError) {
    return (
      <div style={{ ...style, display: 'grid', placeItems: 'center', color: '#b91c1c', fontWeight: 700 }}>
        {loadError}
      </div>
    );
  }

  return <div ref={containerRef} style={style} />;
};

export default GoogleMapView;
