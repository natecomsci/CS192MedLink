<script>
  let { serviceType} = $props();
</script>

<h3>{serviceType}</h3>
<label>
  Service Phone Number
  <input 
    type="tel"
    placeholder="+63 9"
    value="+63 9"
  >
</label>
<label>
  Load
  <input 
    type="text"
    placeholder="steady, closed (to update to drop down)"
  >
</label>

<label>
  Available Beds
  <input 
    type="number"
    placeholder=100
    class = "w-20"
  >
</label>

<label>
  # of non-urgent patients being attended to
  <input 
    type="number"
    placeholder=3
    class = "w-20"
  >
</label>

<label>
  # of non-urgent patients in queue
  <input 
    type="number"
    placeholder=1
    class = "w-20"
  >
</label>

<label>
  # of urgent patients being attended to
  <input 
    type="number"
    placeholder=5
    class = "w-20"
  >
</label>

<label>
  # of urgent patients in queue
  <input 
    type="number"
    placeholder=0
    class = "w-20"
  >
</label>

<label>
  # of critical patients being attended to
  <input 
    type="number"
    placeholder=1
    class = "w-20"
  >
</label>

<label>
  # of critical patients in queue
  <input 
    type="number"
    placeholder=0
    class = "w-20"
  >
</label>