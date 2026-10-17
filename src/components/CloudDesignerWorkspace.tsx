import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getVisualDesignerData, saveVisualDesignerData, VisualDesignerWorkspace } from '../lib/firebase';

interface CloudDesignerWorkspaceProps {
  title: string;
  html: string;
  workspace: VisualDesignerWorkspace;
}

type SyncState = 'loading' | 'saved' | 'saving' | 'error';

const MESSAGE_CHANNEL = 'amc-visual-designer';

export const CloudDesignerWorkspace: React.FC<CloudDesignerWorkspaceProps> = ({
  title,
  html,
  workspace,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const pendingDataRef = useRef<unknown>(null);
  const saveTimerRef = useRef<number | null>(null);
  const [syncState, setSyncState] = useState<SyncState>('loading');

  const loadWorkspace = useCallback(async () => {
    setSyncState('loading');
    try {
      const data = await getVisualDesignerData<unknown>(workspace);
      iframeRef.current?.contentWindow?.postMessage(
        { channel: MESSAGE_CHANNEL, type: 'load', data },
        window.location.origin
      );
      setSyncState('saved');
    } catch {
      setSyncState('error');
    }
  }, [workspace]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.origin !== window.location.origin ||
        event.source !== iframeRef.current?.contentWindow ||
        event.data?.channel !== MESSAGE_CHANNEL ||
        event.data?.type !== 'save'
      ) {
        return;
      }

      pendingDataRef.current = event.data.data;
      setSyncState('saving');
      if (saveTimerRef.current !== null) window.clearTimeout(saveTimerRef.current);
      saveTimerRef.current = window.setTimeout(async () => {
        try {
          await saveVisualDesignerData(workspace, pendingDataRef.current);
          setSyncState('saved');
        } catch {
          setSyncState('error');
        }
      }, 500);
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
      if (saveTimerRef.current !== null) {
        window.clearTimeout(saveTimerRef.current);
        saveVisualDesignerData(workspace, pendingDataRef.current).catch((error) => {
          console.error(`Could not save ${workspace} data before leaving the page:`, error);
        });
      }
    };
  }, [workspace]);

  const statusText = {
    loading: 'সার্ভার থেকে ডেটা লোড হচ্ছে…',
    saving: 'সার্ভারে সেভ হচ্ছে…',
    saved: 'সার্ভারে সেভ হয়েছে',
    error: 'সার্ভারে সেভ/লোড হয়নি — সংযোগ ও অনুমতি পরীক্ষা করুন',
  }[syncState];

  return (
    <>
      <p
        role="status"
        aria-live="polite"
        className={`mb-3 rounded-xl px-3 py-2 text-xs font-semibold ${
          syncState === 'error'
            ? 'bg-red-50 text-red-700'
            : syncState === 'saved'
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-amber-50 text-amber-700'
        }`}
      >
        {statusText}
      </p>
      <iframe
        ref={iframeRef}
        title={title}
        srcDoc={html}
        onLoad={loadWorkspace}
        className="block w-full rounded-3xl border-0 bg-slate-100"
        style={{ height: '1600px', minHeight: '100vh' }}
      />
    </>
  );
};
