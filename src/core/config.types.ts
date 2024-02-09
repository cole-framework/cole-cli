export type CliConfig = {
  plugin_map_url: string;
  local_plugin_map_path: string;
  local_plugin_config_path: string;
  headless_mode: boolean;
  override: boolean;
  skip_tests: boolean;
  with_dependencies: boolean;
  batch_size: number;
  thread_count: number;
  transport: string;
};
