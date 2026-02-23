import { useEffect } from "react"
import { useCueStore } from "../store/useCueStore"

const CHANNEL_NAME = "cue-designer-sync"

type SyncMessage = {
  type: "DESIGN_UPDATE"
  design: ReturnType<typeof useCueStore.getState>["design"]
}

export function useSyncAcrossTabs() {
  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL_NAME)

    channel.onmessage = (event: MessageEvent<SyncMessage>) => {
      if (event.data.type === "DESIGN_UPDATE") {
        useCueStore.getState().loadDesign(event.data.design)
      }
    }

    const unsubscribe = useCueStore.subscribe((state, prevState) => {
      if (state.design !== prevState.design) {
        channel.postMessage({
          type: "DESIGN_UPDATE",
          design: state.design,
        } as SyncMessage)
      }
    })

    return () => {
      channel.close()
      unsubscribe()
    }
  }, [])
}
