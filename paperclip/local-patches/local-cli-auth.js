// Local-only integration: reuse the operator's authenticated Codex CLI without a managed API connection.
import { forbidden, unprocessable } from '../errors.js';
function hasCredential(binding) {
  if (typeof binding === 'string') return binding.trim().length > 0;
  if (binding == null) return false;
  if (binding.type === 'plain') return typeof binding.value !== 'string' || binding.value.trim().length > 0;
  return true;
}
export function selectLocalCliAuth(actor, adapterType, runtime, config, environment = null) {
  if (runtime?.localCliAuth !== true) return null;
  if (actor?.type !== 'board' || actor?.source !== 'local_implicit') throw forbidden('Local CLI authentication can only be selected by the local operator.');
  if (adapterType !== 'codex_local' || config?.engine !== 'cli') throw unprocessable('Local CLI authentication requires the local Codex CLI engine.');
  if (environment && environment.driver !== 'local') throw unprocessable('Local CLI authentication cannot be used in a remote environment.');
  if (runtime.aiConnection) throw unprocessable('Choose either local CLI authentication or a managed AI connection.');
  if (hasCredential(config.env?.OPENAI_API_KEY) || hasCredential(config.env?.CODEX_API_KEY)) throw unprocessable('Remove API keys before selecting ChatGPT CLI authentication.');
  const args = config.extraArgs || [];
  const forced = args.findIndex(value => value === 'forced_login_method="chatgpt"' || value === "forced_login_method='chatgpt'");
  if (forced < 1 || !['-c','--config'].includes(args[forced - 1])) throw unprocessable('Local CLI authentication must explicitly require ChatGPT login.');
  const selected = { ...runtime }; delete selected.aiConnection;
  return selected;
}
