# Synology NAS Card for Home Assistant

A standalone Lovelace card styled after the provided Synology dashboard screenshot. It displays NAS CPU, memory, temperature, uptime, DSM update/status, one volume, up to four drive health tiles, and inbound/outbound network rates.

## Version 1.0.5

- Fixes the card editor rebuilding its form during text entry, which could interrupt typing in fields such as the NAS model.
- Respects sensor units for CPU and RAM values, so a memory quantity in MB is no longer mislabeled as a percentage.
- Selects a two-bay illustration automatically when the model is DS218.
- Switches the overview layout based on card width so the DSM update status remains visible in a narrow dashboard column.
- Refines the DS218 illustration to show its covered front panel rather than exposed drive trays. The drive temperatures now have a label and align within each drive tile.

## What it needs

- Home Assistant's built-in **Synology DSM** integration configured for your NAS.
- The entity IDs for the readings you want to display. The card editor has entity pickers for these fields, so the card does not assume entity IDs or NAS names.
- Some Synology DSM entities are disabled by default. Enable the uptime, volume total size, drive SMART, and any other readings you want under **Settings → Devices & services → Synology DSM → your NAS/device → Entities**.

The card does not install an integration or connect to DSM directly. It only reads entities already exposed to Home Assistant.

## Install from a GitHub repository through HACS

1. Create a GitHub repository and upload the files from this folder to its root.
2. In Home Assistant, open **HACS → Integrations → ⋮ → Custom repositories**.
3. Add the repository URL and choose **Dashboard** as the category.
4. Install **Synology NAS Card**, then reload the browser.
5. If HACS did not register the resource, add `/hacsfiles/synology-nas-card/synology-nas-card.js` under **Settings → Dashboards → Resources** as a JavaScript module.
6. Add a card, search for **Synology NAS Card**, and select your entities in the visual editor.

No Home Assistant restart is required for the frontend card.

## Add it with YAML

Use **Add card → Manual** and start with:

```yaml
type: custom:synology-nas-card
name: Synology NAS
model: DS918+
volume_name: Volume 1
cpu_entity: sensor.replace_with_your_cpu_sensor
ram_entity: sensor.replace_with_your_memory_sensor
temperature_entity: sensor.replace_with_your_nas_temperature_sensor
uptime_entity: sensor.replace_with_your_uptime_sensor
update_entity: update.replace_with_your_dsm_update_entity
volume_used_entity: sensor.replace_with_your_volume_used_sensor
volume_total_entity: sensor.replace_with_your_volume_total_sensor
volume_percent_entity: sensor.replace_with_your_volume_percent_sensor
volume_status_entity: sensor.replace_with_your_volume_status_sensor
network_in_entity: sensor.replace_with_your_download_sensor
network_out_entity: sensor.replace_with_your_upload_sensor
drive_1_name: Drive 1
drive_1_temperature_entity: sensor.replace_with_drive_1_temperature
drive_1_status_entity: sensor.replace_with_drive_1_status
drive_1_smart_entity: sensor.replace_with_drive_1_smart_status
```

These are placeholders. Replace them with entity IDs from your own Home Assistant instance. You can add `drive_2_*` through `drive_4_*` fields for additional drives. Leave fields blank to hide readings you do not have.

`image` accepts an image URL or a Home Assistant local path such as `/local/synology-ds918.png`. When omitted, the card draws a generic four-bay NAS illustration.

## Notes

- Drive temperature sparklines collect readings during the current browser session. They begin filling as the card receives new sensor values.
- Network readings are shown in Mbit/s and converted from common byte-per-second or bit-per-second sensor units. Select the Synology DSM **Download throughput** entity for inbound and **Upload throughput** for outbound.
- The status badge uses the configured update entity when supplied; otherwise it uses the optional overall-status entity. Without either, it displays “Status unavailable.”
- Missing or unavailable values display as an em dash instead of being presented as zero.
