<script>
    import { onMount } from "svelte";
  
    let phoneNumber = "";
    let userLocation = { lat: 14.5995, lng: 120.9842 }; // Default: Manila, Philippines
    let mapUrl = ""; 
  
    // Simulate tracking the user
    onMount(() => {
      setInterval(() => {
        // Fake movement by slightly altering the coordinates
        userLocation = {
          lat: userLocation.lat + (Math.random() - 0.5) * 0.001,
          lng: userLocation.lng + (Math.random() - 0.5) * 0.001,
        };
        mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=Manila,Philippines&zoom=13&size=600x300&maptype=roadmap&markers=color:red%7C14.5995,120.9842`;
      }, 2000);
    });
  
    function requestAmbulance() {
      alert(`Ambulance requested for ${phoneNumber} at location (${userLocation.lat}, ${userLocation.lng})`);
    }
</script>

<style>
  /* Ensuring the body takes full viewport height */
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f4f6f9;
  }

  .container {
    width: 100%;
    max-width: 450px; /* Max width for the container */
    background-color: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    text-align: center;
    transition: all 0.3s ease-in-out;
  }

  h2 {
    font-size: 24px;
    margin-bottom: 20px;
    color: #e63946;
  }

  p {
    font-size: 16px;
    color: #333;
    margin-bottom: 20px;
  }

  input {
    width: 100%;
    padding: 12px 15px;
    margin: 10px 0;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    outline: none;
    transition: border-color 0.3s ease-in-out;
  }

  input:focus {
    border-color: #e63946;
    box-shadow: 0 0 5px rgba(230, 57, 70, 0.5);
  }

  button {
    background-color: #e63946;
    color: white;
    padding: 12px 0;
    border: none;
    width: 100%;
    cursor: pointer;
    border-radius: 8px;
    font-size: 16px;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: #d72a35;
  }

  .map-container {
    margin-top: 30px;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  img {
    width: 100%;
    border-radius: 10px;
  }

  @media screen and (max-width: 500px) {
    .container {
      padding: 20px;
    }
  }
</style>

<div class="container">
  <h2>🚑 Request an Ambulance</h2>
  <p>Enter your phone number:</p>

  <input type="tel" bind:value={phoneNumber} placeholder="Enter phone number" />

  <button on:click={requestAmbulance}>Request an Ambulance</button>

  <h3>Your Location</h3>
  {#if mapUrl}
    <div class="map-container">
      <img 
        src="https://i.ibb.co/67HcDqLc/maya.jpg" 
        alt="Map tracking your location" 
        border="0"
      />
    </div>
  {:else}
    <p>Loading map...</p>
  {/if}
</div>
