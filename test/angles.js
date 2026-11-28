import { adjust } from "../src/angles.js";
import * as check from "../node_modules/htest.dev/src/check.js";

export default {
	name: "Angle pre-interpolation adjustment tests",
	description: "These tests test how angles adapt to different hue interpolation strategies.",
	run: adjust,
	check: check.deep(check.proximity({ epsilon: 0.0005 })),
	tests: [
		{
			args: [undefined, [-20, 380]],
			expect: [340, 20],
		},
		{
			args: ["increasing", [-20, 380]],
			expect: [340, 380],
		},
		{
			args: ["decreasing", [-20, 380]],
			expect: [340, 20],
		},
		{
			args: ["longer", [-20, 380]],
			expect: [340, 20],
		},
		{
			args: ["shorter", [-20, 380]],
			expect: [340, 380],
		},
		{
			args: ["raw", [-20, 380]],
			expect: [-20, 380],
		},
		{
			name: "Longer and Undefined",
			description: `A missing hue is carried over from the other color, so both angles are the
			same hue. There is no arc to lengthen: wrapping by 360 would put the midpoint on the
			opposite hue, so the shared hue is kept instead.`,
			args: ["longer", [90, null]],
			expect: [90, 90],
		},
		{
			name: "Longer and Same Hues",
			description: `When both hues are identical, the "longer" arc must not wrap around by
			360 degrees: that would move the midpoint to the opposite hue (e.g. 30 → 210).
			The hue stays constant, just like the shorter arc.`,
			args: ["longer", [90, 90]],
			expect: [90, 90],
		},
		{
			name: "Longer with a non-zero difference still takes the long way",
			description: `The 350 → 10 pair is not a same-hue pair: its longer arc passes through
			180, so the second angle must not be wrapped to 370 (which would collapse it to the
			shorter arc through 360).`,
			args: ["longer", [350, 10]],
			expect: [350, 10],
		},
		{
			name: "Longer wraps across the 0/360 boundary for a non-zero difference",
			args: ["longer", [10, 20]],
			expect: [370, 20],
		},
	],
};
