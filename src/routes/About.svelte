
<script lang="ts">
    import * as Accordion from "$lib/components/ui/accordion";
    import * as Alert from "$lib/components/ui/alert";

  </script>   
  <Accordion.Root>
    <Accordion.Item value="item-1">
      <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
      <Accordion.Content>
        Yes. It adheres to the WAI-ARIA design pattern.
      </Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value="item-2">
        <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
        <Accordion.Content>
          Yes. It adheres to the WAI-ARIA design pattern.
        </Accordion.Content>
      </Accordion.Item>
  </Accordion.Root>
   
  <Alert.Root >
    <Alert.Title>Heads up!</Alert.Title>
    <Alert.Description>
      You can add components to your app using the cli.
    </Alert.Description>
  </Alert.Root>