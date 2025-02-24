<script lang='ts'>
  let { form } = $props();

</script>


<label>
  <h3>Service Phone Number</h3>
  <p>
    Format: +63 912 345 6789
  </p>
  <input 
    name="phoneNumber"
    type="tel"
    value="+63 9"
    required 
    class="grid grid-cols-1"
  >
  <!-- {#if form?.error == "Phone"}
    <p class="error">{form.error}</p>
  {/if} -->
</label>
<label>
  Operating Time
  <input 
    name="opening"
    type="time"
    value="08:00" 
    required
  >
  <input 
    name="closing" 
    type="time"
    value="16:00" 
    required
  >
</label>

<label>
  Base Price
  <input 
    name="price" 
    type="number"
    placeholder=100
    class = "w-20"
    required
  >
  pesos
</label>

<label>
  Minimum coverage radius
  <input 
    name="minCoverageRadius" 
    type="number"
    placeholder=1
    class = "w-20"
    required
  >
  km
</label>

<label>
  Mileage rate
  <input 
    name="mileageRate"
    type="number"
    placeholder=1.5
    class = "w-20"
    required
  >
</label>

<label>
  Maximum coverage radius
  <input 
    name="maxCoverageRadius" 
    type="number"
    placeholder=1
    class = "w-20"
    required
  >
  km
</label>