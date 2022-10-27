import React from 'react';
import ReactPlayer from 'react-player';



class ResponsivePlayer extends React.Component {
    state = {
        url: 'null',
        pip: false,
        playing: true,
        controls: false,
        light: false,
        volume: 0.8,
        muted: false,
        played: 0,
        loaded: 0,
        duration: 0,
        playbackRate: 1.0,
        loop: false
    }
    load = url => {
        this.setState({
            url,
            played: 0,
            loaded: 0,
            pip: false
        })
    }
    handlePlayPause = () => {
        this.setState({ playing: !this.state.playing })
    }

    handleStop = () => {
        this.setState({ url: null, playing: false })
    }

    handleToggleControls = () => {
        const url = this.state.url
        this.setState({
            controls: !this.state.controls,
            url: null
        }, () => this.load(url))
    }

    handleToggleLight = () => {
        this.setState({ light: !this.state.light })
    }

    handleToggleLoop = () => {
        this.setState({ loop: !this.state.loop })
    }

    handleVolumeChange = e => {
        this.setState({ volume: parseFloat(e.target.value) })
    }

    handleToggleMuted = () => {
        this.setState({ muted: !this.state.muted })
    }

    handleSetPlaybackRate = e => {
        this.setState({ playbackRate: parseFloat(e.target.value) })
    }

    handleOnPlaybackRateChange = (speed) => {
        this.setState({ playbackRate: parseFloat(speed) })
    }

    handleTogglePIP = () => {
        this.setState({ pip: !this.state.pip })
    }

    handlePlay = () => {
        console.log('onPlay')
        this.setState({ playing: true })
    }

    handleEnablePIP = () => {
        console.log('onEnablePIP')
        this.setState({ pip: true })
    }

    handleDisablePIP = () => {
        console.log('onDisablePIP')
        this.setState({ pip: false })
    }

    handlePause = () => {
        console.log('onPause')
        this.setState({ playing: false })
    }

    handleSeekMouseDown = e => {
        this.setState({ seeking: true })
    }

    handleSeekChange = e => {
        this.setState({ played: parseFloat(e.target.value) })
    }

    handleSeekMouseUp = e => {
        this.setState({ seeking: false })
        this.player.seekTo(parseFloat(e.target.value))
    }

    handleProgress = state => {
        console.log('onProgress', state)
        // We only want to update time slider if we are not currently seeking
        if (!this.state.seeking) {
            this.setState(state)
        }
    }

    handleEnded = () => {
        console.log('onEnded')
        this.setState({ playing: this.state.loop })
    }

    handleDuration = (duration) => {
        console.log('onDuration', duration)
        this.setState({ duration })
    }

    renderLoadButton = (url, label) => {
        return (
            <button onClick={() => this.load(url)}>
                {label}
            </button>
        )
    }

    ref = player => {
        this.player = player
    }
    render () {
        const { url, playing, controls, light, volume, muted, loop, played, loaded, duration, playbackRate, pip } = this.state
        const SEPARATOR = ' · '
        return (
            <>
                <div className='player-wrapper'>
                    <ReactPlayer
                        ref={this.ref}
                        className='react-player'
                        width='100%'
                        height='100%'
                        url={url}
                        pip={pip}
                        playing={playing}
                        controls={controls}
                        light={light}
                        loop={loop}
                        playbackRate={playbackRate}
                        volume={volume}
                        muted={muted}
                        onReady={() => console.log('onReady')}
                        onStart={() => console.log('onStart')}
                        onPlay={this.handlePlay}
                        onEnablePIP={this.handleEnablePIP}
                        onDisablePIP={this.handleDisablePIP}
                        onPause={this.handlePause}
                        onBuffer={() => console.log('onBuffer')}
                        onPlaybackRateChange={this.handleOnPlaybackRateChange}
                        onSeek={e => console.log('onSeek', e)}
                        onEnded={this.handleEnded}
                        onError={e => console.log('onError', e)}
                        onProgress={this.handleProgress}
                        onDuration={this.handleDuration}
                    />
                </div>
                <table>
                    <tbody>
                    <tr>
                        <th>Controls</th>
                        <td>
                            <button onClick={this.handleStop}>Stop</button>
                            <button onClick={this.handlePlayPause}>{playing ? 'Pause' : 'Play'}</button>
                            <button onClick={this.handleClickFullscreen}>Fullscreen</button>
                            {light &&
                                <button onClick={() => this.player.showPreview()}>Show preview</button>}
                            {ReactPlayer.canEnablePIP(url) &&
                                <button onClick={this.handleTogglePIP}>{pip ? 'Disable PiP' : 'Enable PiP'}</button>}
                        </td>
                    </tr>
                    <tr>
                        <th>Speed</th>
                        <td>
                            <button onClick={this.handleSetPlaybackRate} value={1}>1x</button>
                            <button onClick={this.handleSetPlaybackRate} value={1.5}>1.5x</button>
                            <button onClick={this.handleSetPlaybackRate} value={2}>2x</button>
                        </td>
                    </tr>
                    <tr>
                        <th>Seek</th>
                        <td>
                            <input
                                type='range' min={0} max={0.999999} step='any'
                                value={played}
                                onMouseDown={this.handleSeekMouseDown}
                                onChange={this.handleSeekChange}
                                onMouseUp={this.handleSeekMouseUp}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>Volume</th>
                        <td>
                            <input type='range' min={0} max={1} step='any' value={volume} onChange={this.handleVolumeChange} />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            <label htmlFor='controls'>Controls</label>
                        </th>
                        <td>
                            <input id='controls' type='checkbox' checked={controls} onChange={this.handleToggleControls} />
                            <em>&nbsp; Requires player reload</em>
                        </td>
                    </tr>
                    <tr>
                        <th>
                            <label htmlFor='muted'>Muted</label>
                        </th>
                        <td>
                            <input id='muted' type='checkbox' checked={muted} onChange={this.handleToggleMuted} />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            <label htmlFor='loop'>Loop</label>
                        </th>
                        <td>
                            <input id='loop' type='checkbox' checked={loop} onChange={this.handleToggleLoop} />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            <label htmlFor='light'>Light mode</label>
                        </th>
                        <td>
                            <input id='light' type='checkbox' checked={light} onChange={this.handleToggleLight} />
                        </td>
                    </tr>
                    <tr>
                        <th>Played</th>
                        <td><progress max={1} value={played} /></td>
                    </tr>
                    <tr>
                        <th>Loaded</th>
                        <td><progress max={1} value={loaded} /></td>
                    </tr>
                    </tbody>
                </table>
                <table>
                    <tbody>

                    <tr>
                        <th>Files</th>
                        <td>
                            {this.renderLoadButton('https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4', 'mp4')}
                            {this.renderLoadButton('https://test-videos.co.uk/vids/bigbuckbunny/webm/vp8/360/Big_Buck_Bunny_360_10s_1MB.webm', 'webm')}
                            {this.renderLoadButton('https://filesamples.com/samples/video/ogv/sample_640x360.ogv', 'ogv')}
                            {this.renderLoadButton('https://storage.googleapis.com/media-session/elephants-dream/the-wires.mp3', 'mp3')}
                            <br />
                            {this.renderLoadButton('https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8', 'HLS (m3u8)')}
                            {this.renderLoadButton('http://dash.edgesuite.net/envivio/EnvivioDash3/manifest.mpd', 'DASH (mpd)')}
                        </td>
                    </tr>
                    <tr>
                        <th>Custom URL</th>
                        <td>
                            <input ref={input => { this.urlInput = input }} type='text' placeholder='Enter URL' />
                            <button onClick={() => this.setState({ url: this.urlInput.value })}>Load</button>
                        </td>
                    </tr>
                    </tbody>
                </table>


            </>

        )
    }
}

export default ResponsivePlayer