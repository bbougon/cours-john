import {useArtists} from "../hooks/hooks.ts";

export const Header = () => {
    const artistsProvider = useArtists();
    return (<header>
        <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">John Guitar Classes.</h2>
            <p className="mt-2 text-lg leading-8 text-gray-600"># artists: {artistsProvider.artists().length}</p>
        </div>
    </header>)
}