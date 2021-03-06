getTeamIcon = function(config) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            type: "GET",
            url: "https://api.esa.io/v1/teams/" + config.teamName,
            data: {
                access_token: config.token
            },
            success: function(response) {
                config.teamIcon = response.icon;
                resolve(config);
            },
            error: reject
        });
    });
}

saveConfig = function(config) {
    chrome.storage.sync.set(config, function(){
        showMessage("Saved!(\\( ⁰⊖⁰)/)", true)
    });
}

notifyInvalidConfig = function(config) {
    var teamName = $(".options__team-name").val();
    var token = $(".options__token").val();

    showMessage("invalid teamname or token (\\( ˘⊖˘)/)", false);
}

showMessage = function(message, succeeded) {
    var messageDom = $(".options__message");

    $(".message").show();
    messageDom.removeClass('message__body-color-success');
    messageDom.removeClass('message__body-color-failure');

    messageDom.text(message);

    if (succeeded) {
        messageDom.addClass('message__body-color-success');
        setTimeout(function() {
            $(".message").fadeOut("normal", function() {
                messageDom.text("");
            });
        }, 2000);
    } else {
        messageDom.addClass('message__body-color-failure');
    }
}

toggleButton = function(disabled) {
    $(".options__save").prop("disabled", disabled);
    $(".options__save").text(disabled ? "Saving..." : "Save Options");
}

$(function() {
    var defaultConfig = {teamName: "", token: ""};
    chrome.storage.sync.get(defaultConfig, function(config) {
        $(".options__team-name").val(config.teamName);
        $(".options__token").val(config.token);
    });

    $(".options__save").on("click", function() {
        toggleButton(true);
        var config = {
            teamName: $(".options__team-name").val(),
            token: $(".options__token").val()
        };
        getTeamIcon(config).then(saveConfig).catch(notifyInvalidConfig).finally(function() {
            toggleButton(false);
        });
    });
});
