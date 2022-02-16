<graphjs-input-file class="graphjs-element graphjs-root">
    <input
        type="file"
        ref="input"
        class="filepond"
        name="filepond[]" />
    <script>
        import {registerPlugin, create, setOptions, destroy} from 'filepond';
        import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
        import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
        import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';

        this.type = opts.type || 'document';
        this.acceptedFileTypes = null;
        this.maxFileSize = null;
        this.allowMultiple = false;

        this.on('mount', () => {
            this.setUploader();
        });

        this.setUploader = () => {
            this.uploader && destroy(this.refs.input);
            this.uploader = create(this.refs.input);
            if(this.type === 'photo') {
                this.acceptedFileTypes = [
                    'image/jpeg',
                    'image/png',
                    'image/gif'
                ];
                this.maxFileSize = '5MB';
                this.allowMultiple = true;
            } else if(this.type === 'video') {
                this.acceptedFileTypes = [
                    'video/mp4',
                    'video/mpeg',
                    'video/avi',
                    'video/flv',
                    'video/wmv'
                ];
                this.maxFileSize = '20MB';
                this.allowMultiple = false;
            } else if(this.type === 'document') {
                this.acceptedFileTypes = [
                    'application/pdf',
                    'application/msword',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
                    'application/vnd.ms-word.document.macroEnabled.12',
                    'application/vnd.ms-word.template.macroEnabled.12',
                    'application/vnd.ms-excel,application/vnd.ms-excel',
                    'application/vnd.ms-excel',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
                    'application/vnd.ms-excel.sheet.macroEnabled.12',
                    'application/vnd.ms-excel.template.macroEnabled.12',
                    'application/vnd.ms-excel.addin.macroEnabled.12',
                    'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
                    'application/vnd.ms-powerpoint',
                    'application/vnd.ms-powerpoint',
                    'application/vnd.ms-powerpoint',
                    'application/vnd.ms-powerpoint',
                    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                    'application/vnd.openxmlformats-officedocument.presentationml.template',
                    'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
                    'application/vnd.ms-powerpoint.addin.macroEnabled.12',
                    'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
                    'application/vnd.ms-powerpoint.template.macroEnabled.12',
                    'application/vnd.ms-powerpoint.slideshow.macroEnabled.12',
                    'application/vnd.ms-access'
                ];
                this.maxFileSize = '20MB';
                this.allowMultiple = true;
            }
            this.uploader.setOptions({
                acceptedFileTypes: this.acceptedFileTypes || [],
                maxFileSize: this.maxFileSize || '5MB',
                allowFileTypeValidation: true,
                allowFileSizeValidation: true,
                allowMultiple: this.allowMultiple,
                onprocessfile: (error, file) => console.log('file:', error, file),
                onprocessfiles: () => {
                    opts.callbackFinish && opts.callbackFinish();
                },
                server: {
                    url: window.GraphJSConfig.host,
                    process: (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
                        const formData = new FormData();
                        const data = {};
                        formData.append('files.media', file, file.name);
                        data['public_id'] = window.GraphJSConfig.id;
                        formData.append('data', JSON.stringify(data));
                        const request = new XMLHttpRequest();
                        const apiurl = '/v1/uploadFile';
                        request.open('POST', apiurl);
                        
                        request.upload.onprogress = (e) => {
                            progress(e.lengthComputable, e.loaded, e.total);
                        };
                        request.onload = function() {
                            console.log(request.responseText);
                            const _uploads = JSON.parse(request.responseText);
                            console.log(_uploads);
                            if (request.status >= 200 && request.status < 300) {
                                // the load method accepts either a string (id) or an object
                                //console.log('200');
                                load(_uploads);
                                console.log('200.1');
                                const uploads = [{
                                        url: _uploads.media.url,
                                        filetype: _uploads.media.ext.substring(1),
                                        original_filename: _uploads.media.name,
                                        filesize: _uploads.media.size,
                                        human_filesize: _uploads.media.size,
                                        preview_url: ((this.type === 'document') ?  _uploads.media.url : _uploads.media.formats.thumbnail.url)
                                }];
                                console.log(uploads);
                                opts.callbackSuccess && opts.callbackSuccess(uploads);
                            } else {
                                console.log('not 200');
                                // Can call the error method if something is wrong, should exit after
                                error('oh no');
                                opts.callbackFail && opts.callbackFail(response);
                            }
                        }

                        request.send(formData);

                        return {
                            abort: () => {
                                // This function is entered if the user has tapped the cancel button
                                request.abort();
                                // Let FilePond know the request has been cancelled
                                abort();
                            },
                        };
                    }
                    /*,
                    process: {
                        url:'/uploadFile?public_id=' + window.GraphJSConfig.id,
                        withCredentials: true,
                        onload: response => {
                            response = JSON.parse(response);
                            if(response.success) {
                                opts.callbackSuccess && opts.callbackSuccess(response.uploads);
                            } else {
                                opts.callbackFail && opts.callbackFail(response);
                                alert('There is an error occured during upload.');
                            }
                        },
                        onerror: response => {
                            opts.callbackFail && opts.callbackFail(response);
                        }
                    }
                    */
                }
            });
            this.uploader.on('addfilestart', () => {
                console.log("add file started");
                this.parent.button = false;
            });
            this.uploader.on('addfile', (error, file) => {
                if (error) {
                    console.log("add file error");
                    this.parent.button = true;
                }
            });
            this.uploader.on('processfile', () => {
                console.log("processfile complete");
                this.parent.button = true;
            });
        }
    </script>
</graphjs-input-file>