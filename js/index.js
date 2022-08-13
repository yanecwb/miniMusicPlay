let
    trackUrl = [],
    albums = [],
    trackNames = [],
    coverUrlList = []

$.get('http://www.flechazoblog.site/node_api/FriendLinkCRUD/get_musicList').
    then((data) => {
        trackUrl = data.data.map(i => i.miuscUrl)
        albums = data.data.map(i=>i.song)
        trackNames = data.data.map(i=>i.singer)
        coverUrlList = data.data.map(i=>i.coverUrl)

        $(function () {
            var playerTrack = $("#player-track"), bgArtwork = $('#bg-artwork'), albumName = $('#album-name'), albumArt = $('#album-art'), sArea = $('#s-area'), seekBar = $('#seek-bar'), trackTime = $('#track-time'), insTime = $('#ins-time'), sHover = $('#s-hover'), playPauseButton = $("#play-pause-button"), i = playPauseButton.find('i'), tProgress = $('#current-time'), tTime = $('#track-length'), seekT, seekLoc, seekBarPos, cM, ctMinutes, ctSeconds, curMinutes, curSeconds, durMinutes, durSeconds, playProgress, bTime, nTime = 0, buffInterval = null, tFlag = false,
                playPreviousTrackButton = $('#play-previous'), playNextTrackButton = $('#play-next'), musicListButton = $('#play-list'),musicListCard = $('#music-list'),
                coverImg = $('img'),
                currIndex = -1;

            

            function playPause() {
                setTimeout(function () {
                    if (audio.paused) {
                        playerTrack.addClass('active');
                        albumArt.addClass('active');
                        checkBuffering();
                        i.attr('class', 'fas fa-pause');
                        audio.play();
                    }
                    else {
                        playerTrack.removeClass('active');
                        albumArt.removeClass('active');
                        clearInterval(buffInterval);
                        albumArt.removeClass('buffering');
                        i.attr('class', 'fas fa-play');
                        audio.pause();
                    }
                }, 300);
            }


            function showHover(event) {
                seekBarPos = sArea.offset();
                seekT = event.clientX - seekBarPos.left;
                seekLoc = audio.duration * (seekT / sArea.outerWidth());

                sHover.width(seekT);

                cM = seekLoc / 60;

                ctMinutes = Math.floor(cM);
                ctSeconds = Math.floor(seekLoc - ctMinutes * 60);

                if ((ctMinutes < 0) || (ctSeconds < 0))
                    return;

                if ((ctMinutes < 0) || (ctSeconds < 0))
                    return;

                if (ctMinutes < 10)
                    ctMinutes = '0' + ctMinutes;
                if (ctSeconds < 10)
                    ctSeconds = '0' + ctSeconds;

                if (isNaN(ctMinutes) || isNaN(ctSeconds))
                    insTime.text('--:--');
                else
                    insTime.text(ctMinutes + ':' + ctSeconds);

                insTime.css({ 'left': seekT, 'margin-left': '-21px' }).fadeIn(0);

            }

            function hideHover() {
                sHover.width(0);
                insTime.text('00:00').css({ 'left': '0px', 'margin-left': '0px' }).fadeOut(0);
            }

            function playFromClickedPos() {
                audio.currentTime = seekLoc;
                seekBar.width(seekT);
                hideHover();
            }

            function updateCurrTime() {
                nTime = new Date();
                nTime = nTime.getTime();

                if (!tFlag) {
                    tFlag = true;
                    trackTime.addClass('active');
                }

                curMinutes = Math.floor(audio.currentTime / 60);
                curSeconds = Math.floor(audio.currentTime - curMinutes * 60);

                durMinutes = Math.floor(audio.duration / 60);
                durSeconds = Math.floor(audio.duration - durMinutes * 60);

                playProgress = (audio.currentTime / audio.duration) * 100;

                if (curMinutes < 10)
                    curMinutes = '0' + curMinutes;
                if (curSeconds < 10)
                    curSeconds = '0' + curSeconds;

                if (durMinutes < 10)
                    durMinutes = '0' + durMinutes;
                if (durSeconds < 10)
                    durSeconds = '0' + durSeconds;

                if (isNaN(curMinutes) || isNaN(curSeconds))
                    tProgress.text('00:00');
                else
                    tProgress.text(curMinutes + ':' + curSeconds);

                if (isNaN(durMinutes) || isNaN(durSeconds))
                    tTime.text('00:00');
                else
                    tTime.text(durMinutes + ':' + durSeconds);

                if (isNaN(curMinutes) || isNaN(curSeconds) || isNaN(durMinutes) || isNaN(durSeconds))
                    trackTime.removeClass('active');
                else
                    trackTime.addClass('active');


                seekBar.width(playProgress + '%');

                if (playProgress == 100) {
                    i.attr('class', 'fa fa-play');
                    seekBar.width(0);
                    tProgress.text('00:00');
                    albumArt.removeClass('buffering').removeClass('active');
                    clearInterval(buffInterval);
                }
            }

            function checkBuffering() {
                clearInterval(buffInterval);
                buffInterval = setInterval(function () {
                    if ((nTime == 0) || (bTime - nTime) > 1000)
                        albumArt.addClass('buffering');
                    else
                        albumArt.removeClass('buffering');

                    bTime = new Date();
                    bTime = bTime.getTime();

                }, 100);
            }

            function selectTrack(flag,CurrIndex) {
                if (flag == 0 || flag == 1) {
                    if (currIndex + 1 == trackUrl.length)
                        currIndex = 0
                    else
                        ++currIndex;
                }
                else if(flag == -1)
                    if (currIndex == 0)
                        currIndex = trackUrl.length - 1
                    else
                        --currIndex;
                else {
                    currIndex = CurrIndex
                }
                musicLi[currIndex].children[2].style.color = '#19b5f0'
                musicLi[currIndex].children[3].style.display = 'block'
                const musicLisiblings = $(musicLi[currIndex]).siblings()
                for(let i = 0;i<musicLisiblings.length;i++){
                    musicLisiblings[i].children[2].style.color = ''
                    musicLisiblings[i].children[3].style.display = 'none'
                }
                coverImg.attr('src',coverUrlList[currIndex])
                if (currIndex > -1) {
                    if (flag == 0)
                        i.attr('class', 'fa fa-play');
                    else {
                        albumArt.removeClass('buffering');
                        i.attr('class', 'fa fa-pause');
                    }

                    seekBar.width(0);
                    trackTime.removeClass('active');
                    tProgress.text('00:00');
                    tTime.text('00:00');

                    currAlbum = albums[currIndex];
                    currTrackName = trackNames[currIndex];

                    audio.src = trackUrl[currIndex];

                    nTime = 0;
                    bTime = new Date();
                    bTime = bTime.getTime();

                    if (flag != 0) {
                        audio.play();
                        playerTrack.addClass('active');
                        albumArt.addClass('active');

                        clearInterval(buffInterval);
                        checkBuffering();
                    }

                    albumName.html(currAlbum+"<span style='color:#acaebd;font-size: 12px;'>-"+currTrackName+'</span>');
                    // trackName.text(currTrackName);


                    bgArtwork.css({ 'background-image': 'url(' + coverUrlList[currIndex] + ')' });
                }
                else {
                    if (flag == 0 || flag == 1)
                        --currIndex;
                    else
                        ++currIndex;
                }
            }

            var musicLi
            function initPlayer() {
                const closeMusicList = $('<span style="float: right;cursor: pointer;">x</span>')
                $('#musicList-header').html(`播放列表(${coverUrlList.length})`)
                $('#musicList-header').append(closeMusicList)
                closeMusicList.on('click',()=>{
                    musicListCard.animate({right:'-100%'});
                })
                coverImg.attr('src',coverUrlList[0])
                const musicUl = $(musicListCard.children()[1])
                for(let i = 0;i<trackNames.length;i++){
                    const li = $("<li></li>")
                    const img = $('<img/>')
                    img.addClass('music-listImg')
                    img.attr('src',coverUrlList[i])
                    li.append(`<p style='width:18px;text-align: right;}'>${i+1}.</p>`)
                    li.append(img)
                    const img2 = $("<img style='width: 16px;margin-left:5px;display:none'/>")
                    img2.attr('src','https://s1.328888.xyz/2022/08/13/TN1tk.gif')
                    li.append(`<p style='text-align: right;}'>${albums[i]}-${trackNames[i]}</p>`)
                    li.append(img2)
                    musicUl.append(li)
                }
                musicLi = $('li').children().prevObject
                audio = new Audio();

                selectTrack(0);

                audio.loop = false;
                audio.preload = 'none'

                playPauseButton.on('click', playPause);

                sArea.mousemove(function (event) { showHover(event); });

                sArea.mouseout(hideHover);

                sArea.on('click', playFromClickedPos);

                $(audio).on('timeupdate', updateCurrTime);

                audio.addEventListener('ended', (event) => {
                    selectTrack(1)
                });
                playPreviousTrackButton.on('click', function () { selectTrack(-1); });
                playNextTrackButton.on('click', function () { selectTrack(1); });
                musicListButton.on('click',function() {  musicListCard.animate({right:'0'}); })
                musicUl.on('click',function(e){musicListChange((e.target.innerText).split('.')[0])})
            }

            function musicListChange(CurrIndex){
                selectTrack(3,CurrIndex-1)
                musicListCard.animate({right:'-100%'});
            }
            initPlayer();
        });
    })

