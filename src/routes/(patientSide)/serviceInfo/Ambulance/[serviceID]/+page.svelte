<script lang="ts">
  import type { PageProps } from './$types';
  let { data, form }: PageProps = $props();

  let contactNumber = $state(data.phoneNumber);
</script>


<div class="mt-4">

  <p><strong>Phone:</strong> {contactNumber}</p>
</div>