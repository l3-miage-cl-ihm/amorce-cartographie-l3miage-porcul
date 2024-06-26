import { Component, Signal, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MapOptions, tileLayer, LatLng, LatLngLiteral, marker, icon, Icon, Layer, LeafletMouseEvent } from 'leaflet';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LeafletModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  readonly defaultIcon = computed( () => icon({
    ...Icon.Default.prototype.options,
    iconUrl: 'assets/marker-icon.png',
    iconRetinaUrl: 'assets/marker-icon-2x.png',
    shadowUrl: 'assets/marker-shadow.png'
  }) );
  
  readonly center = signal<LatLng>( new LatLng(45.166672, 5.71667) );
  readonly zoom = signal<number>(12);

  readonly places = signal<readonly LatLngLiteral[]>([
    { lat: 48.858370, lng: 2.294481 },                   // Tour Eiffel
    { lat: 45.193866812447716, lng: 5.768449902534485 }, // UFR IM2AG
    { lat: 44.56414746666089, lng: 6.495827436447144},   // Place Bartelon
  ]);
  
  private readonly sigMarkers = computed(() => 
    this.places().map( ({lat, lng}) => 
    marker([lat, lng], {icon: this.defaultIcon()}) 
  ));

  readonly layers: Signal<Layer[]> = computed(() => ([
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' }),
    ...this.sigMarkers()
  ]));

  addMarker(event : LeafletMouseEvent): void {
    this.places.update(places => [...places, event.latlng]);
    console.log(this.obtenirItineraire());
  }

  async obtenirItineraire(): Promise <Layer[]> {

    let parametre = [this.places().map( ({lat, lng}) => [lat, lng].join(',') ).join(',')];
    const reponse = await fetch(`https://api.openrouteservice.org/v2/directions/driving-car?{coordinates=${parametre}&api_key=5b3ce3597851110001cf6248b3b3b3b7`);
    return reponse.json();
  }

  allerVoirEmbrun(): void {
    this.center.set(new LatLng(44.566672, 6.5));
    this.zoom.set(13);
  }

  allerVoirParis(): void {
    this.center.set(new LatLng(48.856613, 2.352222));
    this.zoom.set(12);
  }

  allerVoirUFR(): void {
    this.center.set(new LatLng(45.19379120519956, 5.768213868141175));
    this.zoom.set(18);
  }

}

