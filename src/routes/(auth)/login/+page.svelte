<script lang="ts">
	import { page } from '$app/stores';
	import { superForm } from 'sveltekit-superforms/client';
	import Pincode from '$lib/components/Pincode.svelte';
	import PincodeInput from '$lib/components/PincodeInput.svelte';
	import Error from '$lib/components/Error.svelte';

	import { toastStore } from '@skeletonlabs/skeleton';
	export let data;

	let otpSent = false;
	let code: string[] = [];
	let value = '';
	let formOtp: HTMLFormElement;

	const { form, errors, enhance } = superForm(data.emailForm, {
		taintedMessage: null,
		onResult: ({ result }) => {
			otpSent = true;
			message = '';
		}
	});

	const {
		form: otpForm,
		errors: otpErrors,
		enhance: otpEnhance,
		message: otpMessage
	} = superForm(data.otpForm, {
		taintedMessage: null
	});

	let message = 'You must be logged in to access this page';
	$: hasRedirect = $page.url.searchParams.get('redirectTo') ? true : false;

	$: if ($otpMessage) {
		toastStore.trigger($otpMessage);
	}
</script>

<div class="space-y-6 lg:w-80">
	{#if hasRedirect}
		<p class="alert">{message}</p>
	{/if}

	<div class="text-center pb-6">
		<h2 class="text-2xl font-bold tracking-tight text-primary-900 unstyled">Sign In / Register</h2>
	</div>

	{#if otpSent}
		<form bind:this={formOtp} method="POST" action="?/checkOtp" use:otpEnhance class="space-y-6">
			<p class="text-slate-800 text-sm text-center">
				We sent a 6 digit code to your
				<strong class="font-semibold">email address</strong>. Please enter the code in order sign
				in.
			</p>
			<div class="flex justify-center">
				<input type="hidden" name="otp" bind:value={$otpForm.otp} />
				<input type="hidden" name="email" bind:value={$otpForm.email} />
				<Pincode
					type="numeric"
					bind:code
					bind:value
					on:complete={(e) => {
						$otpForm.otp = e.detail.value;
						$otpForm.email = $form.email;
						setTimeout(() => {
							formOtp.dispatchEvent(new Event('submit', { bubbles: true }));
						}, 50);
					}}
				>
					<PincodeInput />
					<PincodeInput />
					<PincodeInput class="mr-4" />
					<PincodeInput />
					<PincodeInput />
					<PincodeInput />
				</Pincode>
			</div>

			{#if $otpErrors.otp}
				<div class="text-center">
					<Error>{$otpErrors.otp}</Error>
				</div>
			{/if}

			<div class="flex justify-center px-2">
				<button
					disabled={value.length != 6}
					type="submit"
					class="btn variant-filled-primary w-full"
				>
					Send
				</button>
			</div>
		</form>
	{:else}
		<div>
			<form method="POST" action="?/sendOtp" class="space-y-4" use:enhance>
				<label for="email" class="label">
					<span>Sign In via OTP on Email</span>
					<input
						bind:value={$form.email}
						aria-invalid={$errors.email ? 'true' : undefined}
						class="input"
						id="email"
						name="email"
						type="email"
						autocomplete="email"
						placeholder="Email address"
						required
					/>
					{#if $errors.email}
						<span class="text-sm text-red-600">
							{$errors.email}
						</span>
					{/if}
				</label>

				<button type="submit" class="btn variant-filled-primary w-full"> Sign In </button>
			</form>

			<div class="relative py-6">
				<div class="absolute inset-0 flex items-center" aria-hidden="true">
					<div class="w-full border-t border-gray-200"></div>
				</div>
				<div class="relative flex justify-center text-sm font-medium leading-6">
					<span class="bg-white px-6 text-gray-900">Or</span>
				</div>
			</div>

			<div class="space-y-4">
				<a
					href="/login/google"
					aria-label="Continue with google"
					role="button"
					class="hover:bg-slate-50 py-3 px-4 border rounded-lg border-gray-700 flex items-center"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						xmlns:xlink="http://www.w3.org/1999/xlink"
						viewBox="0 0 48 48"
						class="w-6 h-6"
					>
						<defs>
							<path
								id="a"
								d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
							/>
						</defs>
						<clipPath id="b"><use xlink:href="#a" overflow="visible" /></clipPath>
						<path clip-path="url(#b)" fill="#FBBC05" d="M0 37V11l17 13z" />
						<path clip-path="url(#b)" fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z" />
						<path clip-path="url(#b)" fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z" />
						<path clip-path="url(#b)" fill="#4285F4" d="M48 48L17 24l-4-3 35-10z" />
					</svg>
					<p class="text-base font-medium ml-4 text-gray-700">Continue with Google</p>
				</a>

				<a
					href="/login/facebook"
					aria-label="Continue with facebook"
					role="button"
					class="hover:bg-slate-50 py-3 px-4 border rounded-lg border-gray-700 flex items-center"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						xmlns:xlink="http://www.w3.org/1999/xlink"
						viewBox="0 0 48 48"
						class="w-6 h-6"
					>
						<defs>
							<path
								id="a"
								d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
							/>
						</defs>
						<clipPath id="b"><use xlink:href="#a" overflow="visible" /></clipPath>
						<path clip-path="url(#b)" fill="#FBBC05" d="M0 37V11l17 13z" />
						<path clip-path="url(#b)" fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z" />
						<path clip-path="url(#b)" fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z" />
						<path clip-path="url(#b)" fill="#4285F4" d="M48 48L17 24l-4-3 35-10z" />
					</svg>
					<p class="text-base font-medium ml-4 text-gray-700">Continue with Facebook</p>
				</a>
			</div>
		</div>
	{/if}
</div>

<style>
	:global([data-pincode]) {
		display: flex;
		gap: 0.3rem;
	}

	:global([data-pincode] input) {
		font-size: 32px;
		width: 44px;
		padding: 10px;
		text-align: center;
		border-radius: 5px;
		border: 1px solid #334155;
		background: #f8fafc;
		font-weight: bold;
		color: #0f172a;
		outline: none;
		transition: all 0.1s;
	}

	:global([data-pincode] input:focus) {
		z-index: 1;
		border: 1px solid #06b6d4;
	}
</style>
