import type { StepResult } from "../game/types";

export type SoundAction =
  | {
      at: number;
      duration: number;
      frequency: number;
      gain: number;
      kind: "tone";
      type: OscillatorType;
    }
  | {
      at: number;
      duration: number;
      fromFrequency: number;
      gain: number;
      kind: "sweep";
      toFrequency: number;
      type: OscillatorType;
    };

type SoundPlayer = {
  play: (step: StepResult) => void;
};

export function createSoundPlayer(): SoundPlayer {
  let audioContext: AudioContext | null = null;

  return {
    play(step) {
      const context = getAudioContext();

      if (!context) {
        return;
      }

      const now = context.currentTime;
      const soundPlan = createSoundPlan(step);

      for (const action of soundPlan) {
        if (action.kind === "tone") {
          playTone(context, now + action.at, action);
          continue;
        }

        playSweep(context, now + action.at, action);
      }
    },
  };

  function getAudioContext(): AudioContext | null {
    if (typeof window === "undefined") {
      return null;
    }

    const AudioContextConstructor = window.AudioContext ?? null;

    if (!AudioContextConstructor) {
      return null;
    }

    audioContext ??= new AudioContextConstructor();

    if (audioContext.state === "suspended") {
      void audioContext.resume();
    }

    return audioContext;
  }
}

export function createSoundPlan(step: StepResult): SoundAction[] {
  const plan: SoundAction[] = [];

  if (step.activatedGoals.length > 0) {
    plan.push(
      {
        at: 0,
        duration: 0.2,
        fromFrequency: 220,
        gain: 0.026,
        kind: "sweep",
        toFrequency: 720,
        type: "sawtooth",
      },
      {
        at: 0.06,
        duration: 0.14,
        frequency: 880,
        gain: 0.02,
        kind: "tone",
        type: "triangle",
      },
    );
  }

  switch (step.event) {
    case "blocked":
      plan.push({
        at: 0,
        duration: 0.09,
        frequency: 180,
        gain: 0.028,
        kind: "tone",
        type: "square",
      });
      break;
    case "move":
      plan.push({
        at: 0,
        duration: 0.06,
        frequency: 340,
        gain: 0.022,
        kind: "tone",
        type: "triangle",
      });
      break;
    case "push":
      plan.push(
        {
          at: 0.02,
          duration: 0.08,
          frequency: 250,
          gain: 0.03,
          kind: "tone",
          type: "sawtooth",
        },
        {
          at: 0.065,
          duration: 0.07,
          frequency: 390,
          gain: 0.018,
          kind: "tone",
          type: "triangle",
        },
      );
      break;
    case "reset":
      plan.push({
        at: 0,
        duration: 0.07,
        frequency: 280,
        gain: 0.02,
        kind: "tone",
        type: "triangle",
      });
      break;
    case "win":
      plan.push(
        {
          at: 0,
          duration: 0.22,
          fromFrequency: 300,
          gain: 0.03,
          kind: "sweep",
          toFrequency: 940,
          type: "triangle",
        },
        {
          at: 0.08,
          duration: 0.16,
          frequency: 390,
          gain: 0.03,
          kind: "tone",
          type: "triangle",
        },
        {
          at: 0.14,
          duration: 0.16,
          frequency: 520,
          gain: 0.03,
          kind: "tone",
          type: "triangle",
        },
        {
          at: 0.2,
          duration: 0.16,
          frequency: 680,
          gain: 0.03,
          kind: "tone",
          type: "triangle",
        },
      );
      break;
  }

  return plan;
}

function playTone(
  context: AudioContext,
  startTime: number,
  action: Extract<SoundAction, { kind: "tone" }>,
): void {
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = action.type;
  oscillator.frequency.setValueAtTime(action.frequency, startTime);

  gainNode.gain.setValueAtTime(0.0001, startTime);
  gainNode.gain.exponentialRampToValueAtTime(action.gain, startTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + action.duration);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + action.duration);
}

function playSweep(
  context: AudioContext,
  startTime: number,
  action: Extract<SoundAction, { kind: "sweep" }>,
): void {
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = action.type;
  oscillator.frequency.setValueAtTime(action.fromFrequency, startTime);
  oscillator.frequency.exponentialRampToValueAtTime(
    action.toFrequency,
    startTime + action.duration,
  );

  gainNode.gain.setValueAtTime(0.0001, startTime);
  gainNode.gain.exponentialRampToValueAtTime(action.gain, startTime + 0.015);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + action.duration);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + action.duration);
}
