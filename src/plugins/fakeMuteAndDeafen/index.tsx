/*
 * Plexcord, a modification for Discord's desktop app
 * Copyright (c) 2023 Vendicated and contributors
 * Copyright (c) 2025 MutanPlex
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { plugin, t } from "@api/i18n";
import { definePluginSettings } from "@api/Settings";
import { PcDevs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";
import { findByPropsLazy } from "@webpack";
import { Menu } from "@webpack/common";

const MediaEngineActions = findByPropsLazy("toggleSelfMute");
const NotificationSettingsStore = findByPropsLazy("getDisableAllSounds", "getState");

let updating = false;
async function update() {
    if (updating) return setTimeout(update, 125);
    updating = true;
    const state = NotificationSettingsStore.getState() as { disabledSounds: string[] };
    const toDisable: string[] = [];
    if (!state.disabledSounds.includes("mute")) toDisable.push("mute");
    if (!state.disabledSounds.includes("unmute")) toDisable.push("unmute");

    state.disabledSounds.push(...toDisable);
    await new Promise(r => setTimeout(r, 50));
    await MediaEngineActions.toggleSelfMute();
    await new Promise(r => setTimeout(r, 100));
    await MediaEngineActions.toggleSelfMute();
    state.disabledSounds = state.disabledSounds.filter(i => !toDisable.includes(i));
    updating = false;
}

export const settings = definePluginSettings({
    autoMute: {
        type: OptionType.BOOLEAN,
        description: () => t(plugin.fakeMuteAndDeafen.autoMute.description),
        default: true
    }
});

const fakeVoiceState = {
    _selfMute: false,
    get selfMute() {
        try {
            if (!settings.store.autoMute) return this._selfMute;
            return this.selfDeaf || this._selfMute;
        } catch {
            return this._selfMute;
        }
    },
    set selfMute(value) {
        this._selfMute = value;
    },
    selfDeaf: false,
    selfVideo: false
};

const StateKeys = ["selfDeaf", "selfMute", "selfVideo"] as const;

export default definePlugin({
    name: "FakeMuteAndDeafen",
    description: () => t(plugin.fakeMuteAndDeafen.description),
    authors: [PcDevs.TheArmagan, PcDevs.MutanPlex],
    tags: ["voice", "privacy"],
    settings,
    modifyVoiceState(e) {
        for (const stateKey of StateKeys) {
            e[stateKey] = fakeVoiceState[stateKey] || e[stateKey];
        }
        return e;
    },
    contextMenus: {
        "audio-device-context"(children, d) {
            if (d.renderInputDevices) {
                children.push(
                    <Menu.MenuSeparator />,
                    <Menu.MenuCheckboxItem
                        id="fake-mute"
                        label={t(plugin.fakeMuteAndDeafen.fakeMute)}
                        checked={fakeVoiceState.selfMute}
                        action={() => {
                            fakeVoiceState.selfMute = !fakeVoiceState.selfMute;
                            update();
                        }}
                    />
                );
            }

            if (d.renderOutputDevices) {
                children.push(
                    <Menu.MenuSeparator />,
                    <Menu.MenuCheckboxItem
                        id="fake-deafen"
                        label={t(plugin.fakeMuteAndDeafen.fakeDeafen)}
                        checked={fakeVoiceState.selfDeaf}
                        action={() => {
                            fakeVoiceState.selfDeaf = !fakeVoiceState.selfDeaf;
                            update();
                        }}
                    />
                );
            }
        },
        "video-device-context"(children) {
            children.push(
                <Menu.MenuSeparator />,
                <Menu.MenuCheckboxItem
                    id="fake-video"
                    label={t(plugin.fakeMuteAndDeafen.fakeVideo)}
                    checked={fakeVoiceState.selfVideo}
                    action={() => {
                        fakeVoiceState.selfVideo = !fakeVoiceState.selfVideo;
                        update();
                    }}
                />
            );
        }
    },
    patches: [
        {
            find: "voiceServerPing(){",
            replacement: {
                match: /voiceStateUpdate\((\w+)\){(.{0,10})guildId:/,
                replace: "voiceStateUpdate($1){$1=$self.modifyVoiceState($1);$2guildId:"
            }
        }
    ]
});
