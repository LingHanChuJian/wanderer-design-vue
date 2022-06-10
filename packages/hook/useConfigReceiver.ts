import { inject } from 'vue'
import { defaultConfigProvider } from '../config-provider'
import { ConfigProviderKey } from '../config-provider/interface'

const useConfigReceiver = () => {
    return inject(ConfigProviderKey, defaultConfigProvider)
}

export default useConfigReceiver
