
import t from "tcomb-form-native";
import moment from "moment";

export const Form = t.form.Form;

export const Team = t.struct({
  "name": t.String,
  "mainArea": t.String,
  "level": t.enums({
    "1": "상",
    "2": "중",
    "3": "하"
  }),
  "ageGroup": t.enums({
    "1": "10대",
    "2": "20대",
    "3": "30대",
    "4": "40대 이상",
  }),
  "description": t.String
});

// 수정되어야 함 !!!!!!!
export const teamDefault = {
  "mainArea": "서울시 도봉구",
  "level": "2",
  "ageGroup": "2"
}

export const teamOptions = {
  "fields": {
    "description": {
      "multiline": true,
      "maxLength": 100,
      "stylesheet": {
          ...Form.stylesheet,
          "textbox": {
            ...Form.stylesheet.textbox,
            "normal": {
              ...Form.stylesheet.textbox.normal,
              "height": 100
            },
            "error": {
              ...Form.stylesheet.textbox.error,
              "height": 100
          }
        }
      }
    },
    "mainArea": {
      "hidden": true
    }
  }
};

// ---------------------------------------------------------------------------------------------------------------------------------------------------

export const updateTeamOptions = {
  "fields": {
    "name": {
      "editable": false
    },
    "description": {
      "multiline": true,
      "maxLength": 100,
      "stylesheet": {
          ...Form.stylesheet,
          "textbox": {
            ...Form.stylesheet.textbox,
            "normal": {
              ...Form.stylesheet.textbox.normal,
              "height": 100
            },
            "error": {
              ...Form.stylesheet.textbox.error,
              "height": 100
          }
        }
      }
    },
    "mainArea": {
      "hidden": true
    }
  }
};
